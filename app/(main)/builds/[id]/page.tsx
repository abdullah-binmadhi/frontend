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
import { ArrowLeft, ThumbsUp, Eye, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BuildDetailPage() {
    const params = useParams();
    const { data: build, isLoading } = useBuild(params.id as string);

    if (isLoading) {
        return <div className="h-48 animate-pulse rounded-sm bg-muted" />;
    }

    if (!build) {
        return <div className="py-12 text-center text-muted-foreground">Build not found</div>;
    }

    const champion = mockChampions.find((c) => c.id === build.championId);
    const coreItemData = build.coreItems.map((id) => mockItems.find((i) => i.id === id)).filter(Boolean);
    const situationalItemData = build.situationalItems.map((id) => mockItems.find((i) => i.id === id)).filter(Boolean);

    return (
        <div className="space-y-6">
            <Link
                href="/builds"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Builds
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-sm border border-border bg-card p-6"
            >
                <div className="flex items-start gap-6">
                    {champion && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-gold/20">
                            <Image src={champion.imageUrl} alt={champion.name} fill sizes="64px" className="object-cover" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold font-[var(--font-outfit)]">{build.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{build.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className="text-xs">{build.position}</Badge>
                            {champion && <span className="text-xs text-muted-foreground">{champion.name}</span>}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{build.upvotes}</span>
                                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{(build.views / 1000).toFixed(1)}K</span>
                                {build.author && <span className="flex items-center gap-1"><User className="h-3 w-3" />{build.author}</span>}
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Share2 className="h-3 w-3" />
                        Share
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Core Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Core Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {coreItemData.map((item) =>
                                item ? (
                                    <div key={item.id} className="flex flex-col items-center gap-1.5">
                                        <div className="relative h-14 w-14 overflow-hidden rounded-sm border border-border">
                                            <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                                        </div>
                                        <span className="text-[10px] text-center leading-tight max-w-[56px] truncate">{item.name}</span>
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
                        <div className="flex flex-wrap gap-3">
                            {situationalItemData.map((item) =>
                                item ? (
                                    <div key={item.id} className="flex flex-col items-center gap-1.5">
                                        <div className="relative h-14 w-14 overflow-hidden rounded-sm border border-border">
                                            <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                                        </div>
                                        <span className="text-[10px] text-center leading-tight max-w-[56px] truncate">{item.name}</span>
                                        <span className="text-[10px] text-gold">{item.totalCost}g</span>
                                    </div>
                                ) : null
                            )}
                            {situationalItemData.length === 0 && (
                                <p className="text-sm text-muted-foreground">No situational items</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
