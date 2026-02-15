'use client';

import { useTierList } from '@/lib/hooks/useItems';
import { ItemTierList } from '@/components/item/ItemTierList';
import { ListOrdered } from 'lucide-react';

export default function TierListPage() {
    const { data: tierList, isLoading } = useTierList();

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <ListOrdered className="h-5 w-5 text-gold" />
                    <h1 className="text-xl font-bold font-[var(--font-outfit)]">Item Tier List</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Items ranked by Win Probability Added (WPA) — see what actually wins games
                </p>
            </div>

            {isLoading && (
                <div className="space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-8 w-24 animate-pulse rounded-sm bg-muted" />
                            <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="h-24 animate-pulse rounded-sm bg-muted" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tierList && <ItemTierList entries={tierList} />}
        </div>
    );
}
