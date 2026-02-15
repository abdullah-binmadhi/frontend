'use client';

import { useParams } from 'next/navigation';
import { useItem } from '@/lib/hooks/useItems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ItemDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const { data: item, isLoading } = useItem(id);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-48 animate-pulse rounded-sm bg-muted" />
            </div>
        );
    }

    if (!item) {
        return <div className="py-12 text-center text-muted-foreground">Item not found</div>;
    }

    const statEntries = Object.entries(item.stats);

    return (
        <div className="space-y-6">
            <Link
                href="/items"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Items
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-sm border border-border bg-card p-6"
            >
                <div className="flex items-start gap-6">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-gold/20">
                        <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold font-[var(--font-outfit)]">{item.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
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

            <div className="grid gap-4 md:grid-cols-2">
                {/* Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Item Stats</CardTitle>
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
                    </CardContent>
                </Card>

                {/* Build Path */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Build Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-sm">
                            <span className="text-muted-foreground">Total Cost:</span>{' '}
                            <span className="font-semibold text-gold">{item.totalCost}g</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-muted-foreground">Patch:</span>{' '}
                            <span className="font-semibold">{item.patchVersion}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-muted-foreground">Purchasable:</span>{' '}
                            <span className="font-semibold">{item.purchasable ? 'Yes' : 'No'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
