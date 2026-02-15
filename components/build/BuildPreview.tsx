'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { ThumbsUpIcon, EyeIcon, User03Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { Build } from '@/lib/types';
import { mockChampions } from '@/lib/mock/champions';
import { mockItems } from '@/lib/mock/items';

interface BuildPreviewProps {
    build: Build;
}

export function BuildPreview({ build }: BuildPreviewProps) {
    const champion = mockChampions.find((c) => c.id === build.championId);
    const coreItemData = build.coreItems
        .map((id) => mockItems.find((i) => i.id === id))
        .filter(Boolean);

    return (
        <Link href={`/builds/${build.id}`}>
            <Card className="overflow-hidden border-border bg-card transition-colors duration-150 hover:border-primary/25 cursor-pointer">
                <CardHeader className="pb-2.5">
                    <div className="flex items-start gap-3">
                        {champion && (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm">
                                <Image
                                    src={champion.imageUrl}
                                    alt={champion.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-semibold truncate">
                                {build.name}
                            </CardTitle>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                    {build.position}
                                </Badge>
                                {champion && (
                                    <span>{champion.name}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2.5">
                    {/* Core items */}
                    <div className="flex gap-1.5">
                        {coreItemData.map((item) =>
                            item ? (
                                <div
                                    key={item.id}
                                    className="relative h-8 w-8 rounded-sm overflow-hidden border border-border/50"
                                >
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                    />
                                </div>
                            ) : null
                        )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3.5 text-[11px] text-muted-foreground">
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
                </CardContent>
            </Card>
        </Link>
    );
}
