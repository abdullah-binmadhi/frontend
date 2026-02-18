'use client';

import { useQuizStore } from '@/lib/stores/quiz-store';
import { motion } from 'framer-motion';
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
} from 'recharts';

const metricDescriptions: Record<string, string> = {
    'Precision@K': 'Proportion of recommended champions that are actually relevant to your preferences.',
    'Recall@K': 'Proportion of all relevant champions that appear in the recommendations.',
    'F1-Score@K': 'Harmonic mean of Precision and Recall — balances both metrics.',
    MRR: 'Mean Reciprocal Rank — how high the first relevant champion appears in the list.',
};

export function MetricsPanel() {
    const { metrics, top10, enrichmentStatus } = useQuizStore();

    if (!metrics) return null;

    // Data for bar chart (Precision/Recall/F1 at different K values)
    const barData = [
        { k: 'K=1', Precision: +(metrics.precisionAt1 * 100).toFixed(1), Recall: +(metrics.recallAt1 * 100).toFixed(1), F1: +(metrics.f1At1 * 100).toFixed(1) },
        { k: 'K=3', Precision: +(metrics.precisionAt3 * 100).toFixed(1), Recall: +(metrics.recallAt3 * 100).toFixed(1), F1: +(metrics.f1At3 * 100).toFixed(1) },
        { k: 'K=5', Precision: +(metrics.precisionAt5 * 100).toFixed(1), Recall: +(metrics.recallAt5 * 100).toFixed(1), F1: +(metrics.f1At5 * 100).toFixed(1) },
        { k: 'K=10', Precision: +(metrics.precisionAt10 * 100).toFixed(1), Recall: +(metrics.recallAt10 * 100).toFixed(1), F1: +(metrics.f1At10 * 100).toFixed(1) },
    ];

    // Data for radar chart (algorithm contribution for top 5)
    const radarData = top10.slice(0, 5).map((c) => ({
        champion: c.championName.length > 8 ? c.championName.slice(0, 8) + '…' : c.championName,
        'Random Forest': +c.randomForest.toFixed(1),
        'Decision Tree': +c.decisionTree.toFixed(1),
        KNN: +c.knn.toFixed(1),
    }));

    // Summary metrics cards
    const summaryCards = [
        { label: 'Precision@10', value: (metrics.precisionAt10 * 100).toFixed(0) + '%', desc: 'Relevant in top 10' },
        { label: 'Recall@10', value: (metrics.recallAt10 * 100).toFixed(0) + '%', desc: 'Coverage of relevant' },
        { label: 'F1-Score@10', value: (metrics.f1At10 * 100).toFixed(0) + '%', desc: 'Balanced accuracy' },
        { label: 'MRR', value: metrics.mrr.toFixed(2), desc: 'First relevant rank' },
        { label: 'Relevant Pool', value: String(metrics.relevantCount), desc: 'Champions matched' },
    ];

    // Data source card
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
                    {/* Data source card */}
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

                {/* Charts grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Precision/Recall/F1 at K chart */}
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
                                        contentStyle={{
                                            backgroundColor: '#0F1629',
                                            border: '1px solid rgba(200,170,110,0.2)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
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

                    {/* Algorithm radar chart */}
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
                                    <Radar
                                        name="Random Forest"
                                        dataKey="Random Forest"
                                        stroke="#00D26A"
                                        fill="#00D26A"
                                        fillOpacity={0.15}
                                    />
                                    <Radar
                                        name="Decision Tree"
                                        dataKey="Decision Tree"
                                        stroke="#0AC8B9"
                                        fill="#0AC8B9"
                                        fillOpacity={0.15}
                                    />
                                    <Radar
                                        name="KNN"
                                        dataKey="KNN"
                                        stroke="#C8AA6E"
                                        fill="#C8AA6E"
                                        fillOpacity={0.15}
                                    />
                                    <Legend iconType="square" wrapperStyle={{ fontSize: '11px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0F1629',
                                            border: '1px solid rgba(200,170,110,0.2)',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Metric explanations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6 rounded-xl border border-border bg-card p-5"
                >
                    <h4 className="text-sm font-bold text-foreground mb-3">
                        📐 Metric Definitions
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
                    transition={{ delay: 1.0 }}
                    className="mt-4 rounded-xl border border-border bg-card p-5"
                >
                    <h4 className="text-sm font-bold text-foreground mb-3">
                        🧠 Algorithm Methodology
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#00D26A' }} />
                                <span className="text-xs font-bold text-foreground">Random Forest (40%)</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Ensemble of 10 decision trees using bootstrap aggregating (bagging). Each tree uses a random
                                subset of 5 features, then scores are averaged. Reduces overfitting and provides stable predictions.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#0AC8B9' }} />
                                <span className="text-xs font-bold text-foreground">Decision Tree (30%)</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Rule-based model splitting on Role → Difficulty → Playstyle → Psychological factors.
                                Transparent and interpretable — each split criterion is logged as matched criteria.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#C8AA6E' }} />
                                <span className="text-xs font-bold text-foreground">K-Nearest Neighbors (30%)</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Calculates Euclidean distance between user preferences and champion attributes in a 5-dimensional
                                feature space. Lower distance = higher similarity score.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
