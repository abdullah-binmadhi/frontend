'use client';

import { useParams } from 'next/navigation';
import { useItem } from '@/lib/hooks/useItems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

import { mockItems } from '@/lib/mock/items';
import { Item } from '@/lib/types';

export default function ItemDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const { data: item, isLoading } = useItem(id);

    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="h-40 animate-pulse rounded-sm bg-muted" />
            </div>
        );
    }

    if (!item) {
        return <div className="py-10 text-center text-sm text-muted-foreground">Item not found</div>;
    }

    const statEntries = Object.entries(item.stats);

    // Resolve build components
    const buildComponents = item.buildsFrom
        ?.map((id) => mockItems.find((i) => i.id === id))
        .filter(Boolean) as Item[];

    return (
        <div className="space-y-4">
            <Link
                href="/items"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={15} strokeWidth={1.5} />
                Items
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="rounded-sm border border-border bg-card p-4"
            >
                <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-gold/20">
                        <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold font-[var(--font-outfit)]">{item.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            <Badge className="bg-gold text-navy text-xs">{item.totalCost}g</Badge>
                            {item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-3 md:grid-cols-2">
                {/* Stats */}
                <Card className="md:row-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm">Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {statEntries.map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="font-semibold text-gold">+{value}</span>
                            </div>
                        ))}
                        {statEntries.length === 0 && (
                            <div className="text-sm text-muted-foreground italic">No stats</div>
                        )}
                    </CardContent>
                </Card>

                {/* Build Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Build Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Cost</span>
                            <span className="font-semibold text-gold">{item.totalCost}g</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Patch</span>
                            <span className="font-semibold">{item.patchVersion}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Purchasable</span>
                            <span className="font-semibold">{item.purchasable ? 'Yes' : 'No'}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Recipe / Build Path */}
                {buildComponents && buildComponents.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Recipe</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {buildComponents.map((comp) => (
                                    <Link
                                        key={comp.id}
                                        href={`/items/${comp.id}`}
                                        className="group relative flex flex-col items-center gap-1 rounded-sm border border-border bg-muted/40 p-2 hover:bg-muted transition-colors text-center w-[70px]"
                                    >
                                        <div className="relative h-8 w-8 overflow-hidden rounded-sm border border-border">
                                            <Image src={comp.imageUrl} alt={comp.name} fill sizes="32px" className="object-cover" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground line-clamp-1 w-full">
                                            {comp.name}
                                        </span>
                                        <span className="text-[10px] font-medium text-gold">
                                            {comp.totalCost}g
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
