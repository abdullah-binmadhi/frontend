'use client';

import { useParams } from 'next/navigation';
import { useChampion } from '@/lib/hooks/useChampions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WinProbChart } from '@/components/charts/WinProbChart';
import { StatsRadar } from '@/components/charts/StatsRadar';
import { BuildPreview } from '@/components/build/BuildPreview';
import { mockBuilds } from '@/lib/mock/builds';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function ChampionDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const { data: champion, isLoading } = useChampion(id);

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
                className="relative overflow-hidden rounded-sm border border-border bg-card p-4"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
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

                <TabsContent value="overview" className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        <StatsRadar data={radarData} />
                        <WinProbChart timeline={[]} />
                    </div>
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

                <TabsContent value="matchups">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Matchups</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Matchup data coming soon
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StatBox({
    label,
    value,
    positive,
}: {
    label: string;
    value: string;
    positive?: boolean;
}) {
    return (
        <div className="rounded-sm border border-border bg-muted/30 p-2.5">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div
                className={`mt-0.5 text-base font-bold ${positive === true
                    ? 'text-signal-green'
                    : positive === false
                        ? 'text-signal-red'
                        : ''
                    }`}
            >
                {value}
            </div>
        </div>
    );
}
