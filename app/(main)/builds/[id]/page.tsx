'use client';

import { useParams } from 'next/navigation';
import { useBuild } from '@/lib/hooks/useBuilds';
import { Item } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockChampions } from '@/lib/mock/champions';
import { mockItems } from '@/lib/mock/items';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, ThumbsUpIcon, EyeIcon, User03Icon, Share01Icon, FlashIcon, BookOpen01Icon, StarIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';

export default function BuildDetailPage() {
    const params = useParams();
    const { data: build, isLoading } = useBuild(params.id as string);

    if (isLoading) {
        return <div className="h-40 animate-pulse rounded-sm bg-muted" />;
    }

    if (!build) {
        return <div className="py-10 text-center text-sm text-muted-foreground">Build not found</div>;
    }

    const champion = mockChampions.find((c) => c.id === build.championId);
    const coreItemData: Item[] = build.coreItems.map((id: number) => mockItems.find((i) => i.id === id)).filter((i: any): i is Item => !!i);
    const fullBuildItemData: Item[] = (build.fullBuildItems || []).map((id: number) => mockItems.find((i) => i.id === id)).filter((i: any): i is Item => !!i);
    const situationalItemData: Item[] = build.situationalItems.map((id: number) => mockItems.find((i) => i.id === id)).filter((i: any): i is Item => !!i);

    return (
        <div className="space-y-4">
            <Link
                href="/builds"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={15} strokeWidth={1.5} />
                Builds
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="rounded-sm border border-border bg-card p-4"
            >
                <div className="flex items-start gap-4">
                    {champion && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-gold/20">
                            <Image src={champion.imageUrl} alt={champion.name} fill sizes="56px" className="object-cover" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-xl font-bold font-[var(--font-outfit)]">{build.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{build.description}</p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                            <Badge variant="outline" className="text-xs">{build.position}</Badge>
                            {champion && <span className="text-xs text-muted-foreground">{champion.name}</span>}
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <HugeiconsIcon icon={ThumbsUpIcon} size={12} strokeWidth={1.5} />
                                    {build.upvotes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <HugeiconsIcon icon={EyeIcon} size={12} strokeWidth={1.5} />
                                    {(build.views / 1000).toFixed(1)}K
                                </span>
                                {build.author && (
                                    <span className="flex items-center gap-1">
                                        <HugeiconsIcon icon={User03Icon} size={12} strokeWidth={1.5} />
                                        {build.author}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                        <HugeiconsIcon icon={Share01Icon} size={13} strokeWidth={1.5} />
                        Share
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-4 lg:grid-cols-3">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Itemization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Core Items */}
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Core Items</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {coreItemData.map((item) =>
                                        item ? (
                                            <div key={`core-${item.id}`} className="flex flex-col items-center gap-1 group relative">
                                                <div className="relative h-12 w-12 overflow-hidden rounded-sm border border-gold/40 shadow-sm transition-colors group-hover:border-gold">
                                                    <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                                                </div>
                                                <span className="text-[10px] text-center leading-tight max-w-[48px] truncate">{item.name}</span>
                                                <span className="text-[10px] text-gold">{item.totalCost}g</span>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </div>

                            {/* Full Build Items */}
                            {fullBuildItemData.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">Full Build</h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {fullBuildItemData.map((item) =>
                                            item ? (
                                                <div key={`full-${item.id}`} className="flex flex-col items-center gap-1 group relative">
                                                    <div className="relative h-12 w-12 overflow-hidden rounded-sm border border-border shadow-sm transition-colors group-hover:border-primary/50">
                                                        <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                                                    </div>
                                                    <span className="text-[10px] text-center leading-tight max-w-[48px] truncate">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{item.totalCost}g</span>
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Situational Items */}
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Situational</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {situationalItemData.map((item) =>
                                        item ? (
                                            <div key={item.id} className="flex flex-col items-center gap-1 opacity-90 hover:opacity-100 transition-opacity">
                                                <div className="relative h-10 w-10 overflow-hidden rounded-sm border border-border">
                                                    <Image src={item.imageUrl} alt={item.name} fill sizes="40px" className="object-cover" />
                                                </div>
                                                <span className="text-[9px] text-center leading-tight max-w-[40px] truncate">{item.name}</span>
                                            </div>
                                        ) : null
                                    )}
                                    {situationalItemData.length === 0 && (
                                        <p className="text-sm text-muted-foreground">None specified</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skill Order */}
                    {build.skillOrder && (
                        <Card>
                            <CardHeader className="pb-3 flex flex-row items-center gap-2">
                                <HugeiconsIcon icon={BookOpen01Icon} size={16} strokeWidth={1.5} className="text-muted-foreground" />
                                <CardTitle className="text-sm">Skill Order</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                                    {build.skillOrder.map((skill: string, i: number) => (
                                        <div key={i} className="flex flex-col items-center gap-1 min-w-[24px]">
                                            <span className="text-[9px] text-muted-foreground">{i + 1}</span>
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs font-bold border ${skill === 'R' ? 'border-red-500/50 bg-red-500/10 text-red-400' :
                                                skill === 'Q' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                    skill === 'W' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                                        'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                                                }`}>
                                                {skill}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Runes & Tips */}
                <div className="space-y-4">
                    {/* Runes */}
                    {build.runes && (
                        <Card>
                            <CardHeader className="pb-3 flex flex-row items-center gap-2">
                                <HugeiconsIcon icon={FlashIcon} size={16} strokeWidth={1.5} className="text-muted-foreground" />
                                <CardTitle className="text-sm">Runes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-primary">{build.runes.primary}</span>
                                        <Badge variant="secondary" className="text-[10px] h-4">Primary</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-sm bg-muted/30 border border-border/50">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gold/10 border border-gold/30">
                                            {/* Ideally use rune icons here, fallback to text */}
                                            <span className="text-xs font-bold text-gold">{build.runes.keystone[0]}</span>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium">{build.runes.keystone}</span>
                                            <p className="text-[10px] text-muted-foreground">Keystone</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-muted-foreground">{build.runes.secondary}</span>
                                        <Badge variant="outline" className="text-[10px] h-4">Secondary</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tips */}
                    {build.tips && build.tips.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3 flex flex-row items-center gap-2">
                                <HugeiconsIcon icon={StarIcon} size={16} strokeWidth={1.5} className="text-muted-foreground" />
                                <CardTitle className="text-sm">Pro Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2.5">
                                    {build.tips.map((tip: string, i: number) => (
                                        <li key={i} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
