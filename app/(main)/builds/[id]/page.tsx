'use client';

import { useParams } from 'next/navigation';
import { useBuild } from '@/lib/hooks/useBuilds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockChampions } from '@/lib/mock/champions';
import { mockItems } from '@/lib/mock/items';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, ThumbsUpIcon, EyeIcon, User03Icon, Share01Icon } from '@hugeicons/core-free-icons';
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
    const coreItemData = build.coreItems.map((id) => mockItems.find((i) => i.id === id)).filter(Boolean);
    const situationalItemData = build.situationalItems.map((id) => mockItems.find((i) => i.id === id)).filter(Boolean);

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

            <div className="grid gap-3 md:grid-cols-2">
                {/* Core Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Core Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2.5">
                            {coreItemData.map((item) =>
                                item ? (
                                    <div key={item.id} className="flex flex-col items-center gap-1">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-sm border border-border">
                                            <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                                        </div>
                                        <span className="text-[10px] text-center leading-tight max-w-[48px] truncate">{item.name}</span>
                                        <span className="text-[10px] text-gold">{item.totalCost}g</span>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Situational Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Situational Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2.5">
                            {situationalItemData.map((item) =>
                                item ? (
                                    <div key={item.id} className="flex flex-col items-center gap-1">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-sm border border-border">
                                            <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                                        </div>
                                        <span className="text-[10px] text-center leading-tight max-w-[48px] truncate">{item.name}</span>
                                        <span className="text-[10px] text-gold">{item.totalCost}g</span>
                                    </div>
                                ) : null
                            )}
                            {situationalItemData.length === 0 && (
                                <p className="text-sm text-muted-foreground">None specified</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
