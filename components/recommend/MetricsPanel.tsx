'use client';

import { useQuizStore } from '@/lib/stores/quiz-store';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    AnalyticsUpIcon,
    AiNetworkIcon,
    BookOpen01Icon,
    Target02Icon,
    PercentIcon,
    ChartBarLineIcon,
} from '@hugeicons/core-free-icons';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    Legend,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    LineChart,
    Line,
} from 'recharts';
import type { EnrichedChampionData } from '@/lib/ml/types';

// Shared dark tooltip styles for all charts
const TOOLTIP_STYLE = {
    backgroundColor: 'rgba(10, 14, 28, 0.95)',
    border: '1px solid rgba(200,170,110,0.15)',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    color: '#C8D6E5',
};

const metricDescriptions: Record<string, string> = {
    'Precision@K': 'Proportion of recommended champions that are actually relevant to your preferences.',
    'Recall@K': 'Proportion of all relevant champions that appear in the recommendations.',
    'F1-Score@K': 'Harmonic mean of Precision and Recall — balances both metrics.',
    MRR: 'Mean Reciprocal Rank — how high the first relevant champion appears in the list.',
};

const ALGO_COLORS = {
    rf: '#00D26A',
    dt: '#0AC8B9',
    knn: '#C8AA6E',
};

export function MetricsPanel() {
    const { metrics, top10, enrichmentStatus, enrichedChampions, answers } = useQuizStore();

    if (!metrics) return null;

    // ── Data: Precision/Recall/F1 at K ──
    const barData = [
        { k: 'K=1', Precision: +(metrics.precisionAt1 * 100).toFixed(1), Recall: +(metrics.recallAt1 * 100).toFixed(1), F1: +(metrics.f1At1 * 100).toFixed(1) },
        { k: 'K=3', Precision: +(metrics.precisionAt3 * 100).toFixed(1), Recall: +(metrics.recallAt3 * 100).toFixed(1), F1: +(metrics.f1At3 * 100).toFixed(1) },
        { k: 'K=5', Precision: +(metrics.precisionAt5 * 100).toFixed(1), Recall: +(metrics.recallAt5 * 100).toFixed(1), F1: +(metrics.f1At5 * 100).toFixed(1) },
        { k: 'K=10', Precision: +(metrics.precisionAt10 * 100).toFixed(1), Recall: +(metrics.recallAt10 * 100).toFixed(1), F1: +(metrics.f1At10 * 100).toFixed(1) },
    ];

    // ── Data: Radar (algorithm comparison top 5) ──
    const radarData = top10.slice(0, 5).map((c) => ({
        champion: c.championName.length > 8 ? c.championName.slice(0, 8) + '…' : c.championName,
        'Random Forest': +c.randomForest.toFixed(1),
        'Decision Tree': +c.decisionTree.toFixed(1),
        KNN: +c.knn.toFixed(1),
    }));

    // ── Data: Score Distribution (Area) — all top 10 scores as an area curve ──
    const scoreDistData = top10.map((c, i) => ({
        rank: `#${i + 1}`,
        name: c.championName,
        Score: +c.average.toFixed(1),
        RF: +c.randomForest.toFixed(1),
        DT: +c.decisionTree.toFixed(1),
        KNN: +c.knn.toFixed(1),
    }));

    // ── Data: Feature Match Breakdown (Pie) — how many top 10 match key preferences ──
    const userRole = answers[2] || 'No Preference';
    const userDamageType = answers[7] || 'No Preference';
    const userRange = answers[5] || 'No Preference';
    const userGender = answers[11] || 'No preference';

    const matchCounts = { role: 0, damageType: 0, range: 0, gender: 0, none: 0 };
    top10.forEach((c) => {
        const data = enrichedChampions?.[c.championName] as EnrichedChampionData | undefined;
        if (!data) return;
        let matched = false;
        if (userRole !== 'No Preference' && data.role === userRole) { matchCounts.role++; matched = true; }
        if (userDamageType !== 'No Preference' && data.damageType === userDamageType) { matchCounts.damageType++; matched = true; }
        if (userRange !== 'No Preference' && data.attackRange === userRange) { matchCounts.range++; matched = true; }
        if (userGender !== 'No preference' && data.gender === userGender) { matchCounts.gender++; matched = true; }
        if (!matched) matchCounts.none++;
    });

    const pieData = [
        { name: 'Role Match', value: matchCounts.role, color: '#00D26A' },
        { name: 'Damage Type', value: matchCounts.damageType, color: '#0AC8B9' },
        { name: 'Range Match', value: matchCounts.range, color: '#C8AA6E' },
        { name: 'Gender Match', value: matchCounts.gender, color: '#E879F9' },
    ].filter((d) => d.value > 0);

    // ── Data: Algorithm Contribution Breakdown (stacked bar) ──
    const contributionData = top10.slice(0, 8).map((c) => ({
        name: c.championName.length > 7 ? c.championName.slice(0, 7) + '…' : c.championName,
        RF: +(c.randomForest * 0.4).toFixed(1),
        DT: +(c.decisionTree * 0.3).toFixed(1),
        KNN: +(c.knn * 0.3).toFixed(1),
    }));

    // ── Data: Champion Stat Profile (Radar) — top 3 champion attribute comparisons ──
    const statProfileData = (() => {
        const keys = ['damage', 'toughness', 'control', 'mobility', 'utility'] as const;
        return keys.map((key) => {
            const entry: Record<string, string | number> = { stat: key.charAt(0).toUpperCase() + key.slice(1) };
            top10.slice(0, 3).forEach((c) => {
                const data = enrichedChampions?.[c.championName];
                const label = c.championName.length > 8 ? c.championName.slice(0, 8) + '…' : c.championName;
                entry[label] = data?.[key] ?? 0;
            });
            return entry;
        });
    })();
    const top3Names = top10.slice(0, 3).map(c =>
        c.championName.length > 8 ? c.championName.slice(0, 8) + '…' : c.championName
    );
    const top3Colors = ['#00D26A', '#0AC8B9', '#C8AA6E'];

    // Summary cards
    const summaryCards = [
        { label: 'Precision@10', value: (metrics.precisionAt10 * 100).toFixed(0) + '%', desc: 'Relevant in top 10' },
        { label: 'Recall@10', value: (metrics.recallAt10 * 100).toFixed(0) + '%', desc: 'Coverage of relevant' },
        { label: 'F1-Score@10', value: (metrics.f1At10 * 100).toFixed(0) + '%', desc: 'Balanced accuracy' },
        { label: 'MRR', value: metrics.mrr.toFixed(2), desc: 'First relevant rank' },
        { label: 'Relevant Pool', value: String(metrics.relevantCount), desc: 'Champions matched' },
    ];

    const dataSourceInfo = enrichmentStatus.isLive
        ? { label: 'Data Source', value: `v${enrichmentStatus.patchVersion}`, desc: `Live · ${enrichmentStatus.championCount} champs`, color: 'text-emerald-400' }
        : { label: 'Data Source', value: 'Static', desc: `${enrichmentStatus.championCount} champs`, color: 'text-muted-foreground' };

    return (
        <div className="mx-auto max-w-6xl mt-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {/* Section header */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    <h3 className="text-lg font-bold text-gold-gradient font-[var(--font-outfit)] shrink-0">
                        Quality Metrics & Algorithm Analysis
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>

                {/* Summary metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8">
                    {summaryCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.05 }}
                            className="rounded-xl border border-border bg-card p-4 text-center"
                        >
                            <div className="text-2xl font-bold text-gold">{card.value}</div>
                            <div className="text-xs font-medium text-foreground mt-1">{card.label}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{card.desc}</div>
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85 }}
                        className="rounded-xl border border-border bg-card p-4 text-center"
                    >
                        <div className={`text-2xl font-bold ${dataSourceInfo.color}`}>{dataSourceInfo.value}</div>
                        <div className="text-xs font-medium text-foreground mt-1">{dataSourceInfo.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{dataSourceInfo.desc}</div>
                    </motion.div>
                </div>

                {/* Charts row 1: Precision/Recall + Radar */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Precision/Recall/F1 at K */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                        <h4 className="text-sm font-bold text-foreground mb-1">
                            Precision / Recall / F1 at K
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-4">
                            Performance metrics evaluated at different recommendation cutoffs
                        </p>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,170,110,0.08)" />
                                    <XAxis dataKey="k" tick={{ fill: '#8B95A5', fontSize: 11 }} />
                                    <YAxis
                                        tick={{ fill: '#8B95A5', fontSize: 11 }}
                                        domain={[0, 100]}
                                        tickFormatter={(v) => `${v}%`}
                                    />
                                    <Tooltip
                                        contentStyle={TOOLTIP_STYLE}
                                        cursor={{ fill: 'rgba(200,170,110,0.06)' }}
                                        formatter={(value) => `${value}%`}
                                    />
                                    <Legend iconType="square" wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="Precision" fill="#00D26A" radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="Recall" fill="#0AC8B9" radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="F1" fill="#C8AA6E" radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Algorithm Score Comparison Radar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                        <h4 className="text-sm font-bold text-foreground mb-1">
                            Algorithm Score Comparison (Top 5)
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-4">
                            How each algorithm scored the top 5 recommended champions
                        </p>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData} cx="50%" cy="50%">
                                    <PolarGrid stroke="rgba(200,170,110,0.15)" />
                                    <PolarAngleAxis dataKey="champion" tick={{ fill: '#8B95A5', fontSize: 10 }} />
                                    <Radar name="Random Forest" dataKey="Random Forest" stroke={ALGO_COLORS.rf} fill={ALGO_COLORS.rf} fillOpacity={0.15} />
                                    <Radar name="Decision Tree" dataKey="Decision Tree" stroke={ALGO_COLORS.dt} fill={ALGO_COLORS.dt} fillOpacity={0.15} />
                                    <Radar name="KNN" dataKey="KNN" stroke={ALGO_COLORS.knn} fill={ALGO_COLORS.knn} fillOpacity={0.15} />
                                    <Legend iconType="square" wrapperStyle={{ fontSize: '11px' }} />
                                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Charts row 2: Score Drop-off + Preference Match */}
                <div className="grid gap-6 lg:grid-cols-2 mt-6">
                    {/* Score Drop-off Curve */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.85 }}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                        <h4 className="text-sm font-bold text-foreground mb-1">
                            Score Drop-off Curve
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-4">
                            How the ensemble score decreases across recommendations — steeper = more confident picks
                        </p>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={scoreDistData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,170,110,0.08)" />
                                    <XAxis dataKey="rank" tick={{ fill: '#8B95A5', fontSize: 11 }} />
                                    <YAxis tick={{ fill: '#8B95A5', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip
                                        contentStyle={TOOLTIP_STYLE}
                                        cursor={{ stroke: 'rgba(200,170,110,0.3)' }}
                                        formatter={(value, name) => [`${value}%`, name]}
                                        labelFormatter={(label) => {
                                            const item = scoreDistData.find((d) => d.rank === label);
                                            return item ? `${item.rank} ${item.name}` : label;
                                        }}
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#C8AA6E" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#C8AA6E" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="Score" stroke="#C8AA6E" fill="url(#scoreGradient)" strokeWidth={2} dot={{ r: 3, fill: '#C8AA6E', stroke: '#0A0E1C' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Preference Match Distribution */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                        <h4 className="text-sm font-bold text-foreground mb-1">
                            Preference Match Distribution
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-4">
                            How many of top 10 champions match your key preference filters
                        </p>
                        <div className="h-[260px] flex items-center justify-center">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}/10`}
                                        >
                                            {pieData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} fillOpacity={0.7} stroke={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value} / 10`, 'Champions']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-xs text-muted-foreground">No specific preferences to analyze (all set to "No Preference")</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Charts row 3: Weighted Contribution + Champion Attribute Profile */}
                <div className="grid gap-6 lg:grid-cols-2 mt-6">
                    {/* Weighted Algorithm Contribution */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.95 }}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                        <h4 className="text-sm font-bold text-foreground mb-1">
                            Weighted Algorithm Contribution
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-4">
                            Each algorithm&apos;s weighted contribution to the final score (RF×0.4 + DT×0.3 + KNN×0.3)
                        </p>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={contributionData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,170,110,0.08)" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: '#8B95A5', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                                    <YAxis dataKey="name" type="category" tick={{ fill: '#8B95A5', fontSize: 10 }} width={60} />
                                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(200,170,110,0.06)' }} formatter={(value) => `${value}%`} />
                                    <Legend iconType="square" wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="RF" name="Random Forest" stackId="a" fill={ALGO_COLORS.rf} radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="DT" name="Decision Tree" stackId="a" fill={ALGO_COLORS.dt} radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="KNN" name="KNN" stackId="a" fill={ALGO_COLORS.knn} radius={[0, 3, 3, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Champion Attribute Profile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                        <h4 className="text-sm font-bold text-foreground mb-1">
                            Champion Attribute Profile (Top 3)
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-4">
                            How the top 3 champions compare across core gameplay attributes
                        </p>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={statProfileData} cx="50%" cy="50%">
                                    <PolarGrid stroke="rgba(200,170,110,0.15)" />
                                    <PolarAngleAxis dataKey="stat" tick={{ fill: '#8B95A5', fontSize: 10 }} />
                                    {top3Names.map((name, i) => (
                                        <Radar
                                            key={name}
                                            name={name}
                                            dataKey={name}
                                            stroke={top3Colors[i]}
                                            fill={top3Colors[i]}
                                            fillOpacity={0.1}
                                        />
                                    ))}
                                    <Legend iconType="square" wrapperStyle={{ fontSize: '11px' }} />
                                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Algorithm per-champion line chart */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.05 }}
                    className="mt-6 rounded-xl border border-border bg-card p-5"
                >
                    <h4 className="text-sm font-bold text-foreground mb-1">
                        Per-Algorithm Score Trend
                    </h4>
                    <p className="text-[10px] text-muted-foreground mb-4">
                        Individual algorithm scores across all 10 recommendations — reveals which algorithm drives each pick
                    </p>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scoreDistData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,170,110,0.08)" />
                                <XAxis dataKey="rank" tick={{ fill: '#8B95A5', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#8B95A5', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                                <Tooltip
                                    contentStyle={TOOLTIP_STYLE}
                                    cursor={{ stroke: 'rgba(200,170,110,0.2)' }}
                                    formatter={(value, name) => [`${value}%`, name]}
                                    labelFormatter={(label) => {
                                        const item = scoreDistData.find((d) => d.rank === label);
                                        return item ? `${item.rank} ${item.name}` : label;
                                    }}
                                />
                                <Legend iconType="square" wrapperStyle={{ fontSize: '11px' }} />
                                <Line type="monotone" dataKey="RF" name="Random Forest" stroke={ALGO_COLORS.rf} strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="DT" name="Decision Tree" stroke={ALGO_COLORS.dt} strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="KNN" name="KNN" stroke={ALGO_COLORS.knn} strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Metric explanations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-6 rounded-xl border border-border bg-card p-5"
                >
                    <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <HugeiconsIcon icon={BookOpen01Icon} className="h-4 w-4 text-gold" />
                        Metric Definitions
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {Object.entries(metricDescriptions).map(([name, desc]) => (
                            <div key={name} className="flex gap-3">
                                <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                <div>
                                    <span className="text-xs font-semibold text-foreground">{name}:</span>{' '}
                                    <span className="text-xs text-muted-foreground">{desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Algorithm methodology */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.15 }}
                    className="mt-4 rounded-xl border border-border bg-card p-5"
                >
                    <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <HugeiconsIcon icon={AiNetworkIcon} className="h-4 w-4 text-gold" />
                        Algorithm Methodology
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ALGO_COLORS.rf }} />
                                <span className="text-xs font-bold text-foreground">Random Forest (40%)</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Ensemble of 10 decision trees using bootstrap aggregating (bagging). Each tree evaluates a random
                                subset of 6 features from 11 total (role, damage type, range, gender, position, difficulty, damage, toughness, mobility, control, utility).
                                Hard-filter penalties applied for critical mismatches.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ALGO_COLORS.dt }} />
                                <span className="text-xs font-bold text-foreground">Decision Tree (30%)</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Rule-based model splitting Role → Damage Type → Attack Range → Gender → Position → Difficulty → Playstyle → Psychological.
                                Critical mismatches compound multiplicatively, heavily penalizing champions that violate core preferences.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ALGO_COLORS.knn }} />
                                <span className="text-xs font-bold text-foreground">K-Nearest Neighbors (30%)</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Calculates Euclidean distance with categorical distance penalties. Role mismatch adds 10 distance units,
                                damage type/range adds 9 each, gender adds 7. Lower distance = higher similarity.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
