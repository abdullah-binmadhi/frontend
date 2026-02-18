'use client';

import { useQuizStore } from '@/lib/stores/quiz-store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { EnrichedChampionData } from '@/lib/ml/types';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';

const roleColors: Record<string, string> = {
    Fighter: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Mage: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Assassin: 'bg-red-500/15 text-red-400 border-red-500/30',
    Tank: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Support: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    Marksman: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
};

const algorithmColors = {
    randomForest: { label: 'Random Forest', weight: '40%', color: '#00D26A' },
    decisionTree: { label: 'Decision Tree', weight: '30%', color: '#0AC8B9' },
    knn: { label: 'KNN', weight: '30%', color: '#C8AA6E' },
};

export function ResultsView() {
    const { top10, reset, enrichedChampions, enrichmentStatus } = useQuizStore();
    const { data: allChampions } = useQuery({ queryKey: ['champions'], queryFn: api.champions.getAll });

    // Use enriched data if available, fallback to static imports
    const getChampionData = (name: string): EnrichedChampionData | undefined => {
        if (enrichedChampions) return enrichedChampions[name];
        return undefined;
    };

    return (
        <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gold-gradient font-[var(--font-outfit)] mb-2"
                >
                    Your Champion Recommendations
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-muted-foreground text-sm"
                >
                    Top 10 champions selected by ensemble ML scoring (Random Forest 40% + Decision Tree 30% + KNN 30%)
                </motion.p>

                {/* Live data status */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 flex items-center justify-center gap-3"
                >
                    {enrichmentStatus.isLive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Live Data · Patch {enrichmentStatus.patchVersion}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                            Static Data
                        </span>
                    )}
                    {enrichmentStatus.freeRotationCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-400 border border-sky-500/20">
                            🆓 {enrichmentStatus.freeRotationCount} Free Rotation
                        </span>
                    )}
                </motion.div>
            </div>

            {/* Algorithm weight legend */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-6 flex flex-wrap gap-4 justify-center"
            >
                {Object.values(algorithmColors).map((algo) => (
                    <div key={algo.label} className="flex items-center gap-2 text-xs">
                        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: algo.color }} />
                        <span className="text-muted-foreground">
                            {algo.label} ({algo.weight})
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Champion cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {top10.map((champion, index) => {
                    const data = getChampionData(champion.championName);
                    const roleClass = roleColors[data?.role || ''] || 'bg-muted text-muted-foreground';
                    const maxScore = Math.max(champion.randomForest, champion.decisionTree, champion.knn, 1);
                    const isFree = (data as EnrichedChampionData)?.isFreeRotation;
                    // Resolve champion ID from name (using mock data for now as bridge)
                    const championId = allChampions?.find(c => c.name === champion.championName || c.key === champion.championName)?.id;

                    return (
                        <motion.div
                            key={champion.championName}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                        >
                            <Link
                                href={championId ? `/champions/${championId}` : '#'}
                                className={cn(
                                    'group relative block overflow-hidden rounded-xl border bg-card p-4 card-hover transition-colors',
                                    isFree ? 'border-sky-500/30' : 'border-border',
                                    !championId && 'cursor-default'
                                )}
                            >
                                {/* Rank badge */}
                                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-[10px] font-bold text-gold">
                                    #{index + 1}
                                </div>

                                {/* Free rotation badge */}
                                {isFree && (
                                    <div className="absolute left-3 top-3">
                                        <span className="rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold text-sky-400 border border-sky-500/30">
                                            🆓 FREE
                                        </span>
                                    </div>
                                )}

                                {/* Champion image */}
                                <div className="mb-3 flex justify-center">
                                    <div className={cn(
                                        'relative h-16 w-16 overflow-hidden rounded-full border-2',
                                        isFree ? 'border-sky-400/50' : 'border-gold/30'
                                    )}>
                                        {data?.image ? (
                                            <img
                                                src={data.image}
                                                alt={champion.championName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted text-lg font-bold text-muted-foreground">
                                                {champion.championName[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Name & Role */}
                                <div className="text-center mb-3">
                                    <h3 className="text-sm font-bold text-foreground truncate">
                                        {champion.championName}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                                        <span
                                            className={cn(
                                                'inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium',
                                                roleClass
                                            )}
                                        >
                                            {data?.role}
                                        </span>
                                        {/* DDragon tags */}
                                        {(data as EnrichedChampionData)?.tags?.map((tag) =>
                                            tag !== data?.role ? (
                                                <span
                                                    key={tag}
                                                    className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"
                                                >
                                                    {tag}
                                                </span>
                                            ) : null
                                        )}
                                    </div>
                                </div>

                                {/* Overall score */}
                                <div className="text-center mb-3">
                                    <span className="text-2xl font-bold text-gold">{champion.average.toFixed(1)}</span>
                                    <span className="text-[10px] text-muted-foreground ml-0.5">%</span>
                                </div>

                                {/* Per-algorithm bars */}
                                <div className="space-y-1.5">
                                    {(Object.entries(algorithmColors) as [keyof typeof algorithmColors, typeof algorithmColors[keyof typeof algorithmColors]][]).map(
                                        ([key, algo]) => {
                                            const score = champion[key as keyof typeof champion] as number;
                                            return (
                                                <div key={key} className="flex items-center gap-2">
                                                    <span className="w-6 text-[9px] text-muted-foreground text-right shrink-0">
                                                        {algo.weight}
                                                    </span>
                                                    <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(score / maxScore) * 100}%` }}
                                                            transition={{ delay: index * 0.06 + 0.3, duration: 0.5 }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: algo.color }}
                                                        />
                                                    </div>
                                                    <span className="w-8 text-[9px] text-muted-foreground shrink-0">
                                                        {score.toFixed(0)}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {/* Stats */}
                                {data?.stats && (
                                    <div className="mt-3 pt-3 border-t border-border/50 flex justify-between text-[9px] text-muted-foreground">
                                        <span>WR {data.stats.winRate}%</span>
                                        <span>PR {data.stats.pickRate}%</span>
                                        <span className="font-medium text-gold">{data.stats.tier}</span>
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Retake button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 text-center"
            >
                <button
                    onClick={reset}
                    className="rounded-lg border border-gold/30 px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/10 transition-colors"
                >
                    🔄 Retake Quiz
                </button>
            </motion.div>
        </div>
    );
}
