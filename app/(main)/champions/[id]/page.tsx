'use client';

import { useParams } from 'next/navigation';
import { useChampion, useChampions } from '@/lib/hooks/useChampions';
import { useChampionDetail, ChampionDetail } from '@/lib/hooks/useChampionDetail';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsRadar } from '@/components/charts/StatsRadar';
import { BuildPreview } from '@/components/build/BuildPreview';
import { mockBuilds } from '@/lib/mock/builds';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { useMemo } from 'react';
import type { Champion } from '@/lib/types';

export default function ChampionDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const { data: champion, isLoading } = useChampion(id);
    const { data: detail, isLoading: detailLoading } = useChampionDetail(champion?.key);
    const { data: allChampions } = useChampions();

    // Generate matchup data from all champions
    const matchups = useMemo(() => {
        if (!champion || !allChampions) return { strong: [] as Champion[], weak: [] as Champion[] };

        const champTags = new Set(champion.tags);
        // Simple counter logic: opposing class archetypes
        const counterMap: Record<string, string[]> = {
            Fighter: ['Marksman', 'Mage'],
            Tank: ['Marksman', 'Mage'],
            Assassin: ['Tank', 'Fighter'],
            Mage: ['Assassin', 'Fighter'],
            Marksman: ['Assassin', 'Fighter'],
            Support: ['Assassin'],
        };
        const weakMap: Record<string, string[]> = {
            Fighter: ['Tank'],
            Tank: ['Fighter'],
            Assassin: ['Mage', 'Support'],
            Mage: ['Tank'],
            Marksman: ['Tank', 'Support'],
            Support: ['Fighter', 'Marksman'],
        };

        const counters: string[] = [];
        const weakTo: string[] = [];
        champTags.forEach((tag) => {
            counters.push(...(counterMap[tag] || []));
            weakTo.push(...(weakMap[tag] || []));
        });

        const counterSet = new Set(counters);
        const weakSet = new Set(weakTo);

        const strong = allChampions
            .filter((c) => c.id !== champion.id && c.tags.some((t) => counterSet.has(t)))
            .sort((a, b) => (b.stats?.winRate || 0) - (a.stats?.winRate || 0))
            .slice(0, 6);

        const weak = allChampions
            .filter((c) => c.id !== champion.id && c.tags.some((t) => weakSet.has(t)))
            .sort((a, b) => (b.stats?.winRate || 0) - (a.stats?.winRate || 0))
            .slice(0, 6);

        return { strong, weak };
    }, [champion, allChampions]);

    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="h-40 animate-pulse rounded-sm bg-muted" />
                <div className="h-8 w-48 animate-pulse rounded-sm bg-muted" />
            </div>
        );
    }

    if (!champion) {
        return <div className="py-10 text-center text-sm text-muted-foreground">Champion not found</div>;
    }

    const championBuilds = mockBuilds.filter((b) => b.championId === champion.id);
    const radarData = [
        { stat: 'Win Rate', value: (champion.stats?.winRate || 0.5) * 100, fullMark: 100 },
        { stat: 'Pick Rate', value: (champion.stats?.pickRate || 0.05) * 100 * 5, fullMark: 100 },
        { stat: 'Ban Rate', value: (champion.stats?.banRate || 0.05) * 100 * 5, fullMark: 100 },
        { stat: 'KDA', value: (champion.stats?.avgKda || 2) * 20, fullMark: 100 },
        { stat: 'Games', value: Math.min(100, (champion.stats?.gamesPlayed || 100000) / 3500), fullMark: 100 },
        { stat: 'Mastery', value: 65, fullMark: 100 },
    ];

    return (
        <div className="space-y-4">
            {/* Back */}
            <Link
                href="/champions"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={15} strokeWidth={1.5} />
                Champions
            </Link>

            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-sm border border-border bg-card"
            >
                {/* Splash background */}
                {champion.splashUrl && (
                    <div className="absolute inset-0 opacity-15">
                        <Image
                            src={champion.splashUrl}
                            alt=""
                            fill
                            sizes="100vw"
                            className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    </div>
                )}
                <div className="relative flex flex-col gap-4 md:flex-row md:items-start p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-primary/15">
                        <Image
                            src={champion.imageUrl}
                            alt={champion.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold font-[var(--font-outfit)]">{champion.name}</h1>
                        <p className="text-sm text-muted-foreground">{champion.title}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {champion.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            <Badge variant="outline" className="text-xs">
                                {champion.attackType}
                            </Badge>
                        </div>
                        {champion.stats && (
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <StatBox label="Win Rate" value={`${(champion.stats.winRate * 100).toFixed(1)}%`} positive={champion.stats.winRate >= 0.5} />
                                <StatBox label="Pick Rate" value={`${(champion.stats.pickRate * 100).toFixed(1)}%`} />
                                <StatBox label="Ban Rate" value={`${(champion.stats.banRate * 100).toFixed(1)}%`} />
                                <StatBox label="Avg KDA" value={champion.stats.avgKda.toFixed(1)} />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-3">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="builds">Builds</TabsTrigger>
                    <TabsTrigger value="matchups">Matchups</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Lore */}
                    {detail?.lore && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Lore</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">{detail.lore}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Ratings */}
                    {detail?.info && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Champion Ratings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {(['attack', 'defense', 'magic', 'difficulty'] as const).map((key) => (
                                        <div key={key} className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground capitalize">{key}</span>
                                                <span className="text-xs font-semibold">{detail.info[key]}/10</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${detail.info[key] * 10}%` }}
                                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                                    className="h-full rounded-full bg-gold"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Abilities */}
                    {detail && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Abilities</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Passive */}
                                <AbilityRow
                                    label="P"
                                    name={detail.passive.name}
                                    description={detail.passive.description}
                                    image={detail.passive.image}
                                />
                                {/* Q W E R */}
                                {detail.spells.map((spell) => (
                                    <AbilityRow
                                        key={spell.key}
                                        label={spell.key}
                                        name={spell.name}
                                        description={spell.description}
                                        image={spell.image}
                                        cooldown={spell.cooldown}
                                        cost={spell.cost}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Charts */}
                    <div className="grid gap-3 md:grid-cols-2">
                        <StatsRadar data={radarData} />
                        {/* Tips */}
                        {detail && (detail.tips.ally.length > 0 || detail.tips.enemy.length > 0) && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Tips</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {detail.tips.ally.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-signal-green mb-1.5">Playing As</h4>
                                            <ul className="space-y-1">
                                                {detail.tips.ally.map((tip, i) => (
                                                    <li key={i} className="text-xs text-muted-foreground leading-relaxed">• {tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {detail.tips.enemy.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-signal-red mb-1.5">Playing Against</h4>
                                            <ul className="space-y-1">
                                                {detail.tips.enemy.map((tip, i) => (
                                                    <li key={i} className="text-xs text-muted-foreground leading-relaxed">• {tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {detailLoading && (
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="h-32 animate-pulse rounded-sm bg-muted" />
                            <div className="h-32 animate-pulse rounded-sm bg-muted" />
                        </div>
                    )}

                    {/* Skins */}
                    {detail && detail.skins.length > 1 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Skins ({detail.skins.length - 1})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                    {detail.skins.filter(s => s.num !== 0).map((skin) => (
                                        <div key={skin.id} className="group relative overflow-hidden rounded-sm border border-border">
                                            <div className="relative aspect-[3/4] overflow-hidden">
                                                <img
                                                    src={skin.loading}
                                                    alt={skin.name}
                                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card to-transparent p-2 pt-6">
                                                    <p className="text-[11px] font-medium truncate">{skin.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="builds" className="space-y-3">
                    {championBuilds.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {championBuilds.map((build) => (
                                <BuildPreview key={build.id} build={build} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            No builds yet for {champion.name}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="matchups" className="space-y-4">
                    {/* Strong Against */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-signal-green">Strong Against</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {matchups.strong.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                                    {matchups.strong.map((c) => (
                                        <MatchupCard key={c.id} champion={c} type="strong" />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">No matchup data available</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Weak Against */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-signal-red">Weak Against</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {matchups.weak.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                                    {matchups.weak.map((c) => (
                                        <MatchupCard key={c.id} champion={c} type="weak" />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">No matchup data available</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

/* ── Sub-components ── */

function StatBox({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
    return (
        <div className="rounded-sm border border-border bg-muted/30 p-2.5">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className={`mt-0.5 text-base font-bold ${positive === true ? 'text-signal-green' : positive === false ? 'text-signal-red' : ''}`}>
                {value}
            </div>
        </div>
    );
}

function AbilityRow({ label, name, description, image, cooldown, cost }: {
    label: string;
    name: string;
    description: string;
    image: string;
    cooldown?: string;
    cost?: string;
}) {
    return (
        <div className="flex gap-3 rounded-sm border border-border bg-muted/20 p-3">
            <div className="relative shrink-0">
                <div className="relative h-10 w-10 overflow-hidden rounded-sm border border-primary/15">
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-gold/20 text-[9px] font-bold text-gold">
                    {label}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold">{name}</h4>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
                {(cooldown || cost) && (
                    <div className="mt-1.5 flex gap-3 text-[10px] text-muted-foreground">
                        {cooldown && cooldown !== '0' && <span>CD: {cooldown}s</span>}
                        {cost && cost !== '0' && <span>Cost: {cost}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

function MatchupCard({ champion, type }: { champion: Champion; type: 'strong' | 'weak' }) {
    return (
        <Link
            href={`/champions/${champion.id}`}
            className="group flex flex-col items-center gap-1.5 rounded-sm border border-border bg-card p-2.5 transition-colors hover:border-primary/20"
        >
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/15">
                <Image
                    src={champion.imageUrl}
                    alt={champion.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                />
            </div>
            <span className="text-[11px] font-medium truncate max-w-full">{champion.name}</span>
            {champion.stats && (
                <span className={`text-[10px] font-semibold ${type === 'strong' ? 'text-signal-green' : 'text-signal-red'}`}>
                    {(champion.stats.winRate * 100).toFixed(1)}% WR
                </span>
            )}
            <div className="flex flex-wrap gap-0.5 justify-center">
                {champion.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] text-muted-foreground bg-muted px-1 py-0.5 rounded-sm">{tag}</span>
                ))}
            </div>
        </Link>
    );
}
