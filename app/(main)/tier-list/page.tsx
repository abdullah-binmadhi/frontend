'use client';

import { useTierList } from '@/lib/hooks/useItems';
import { ItemTierList } from '@/components/item/ItemTierList';
import { HugeiconsIcon } from '@hugeicons/react';
import { RankingIcon } from '@hugeicons/core-free-icons';

export default function TierListPage() {
    const { data: tierList, isLoading } = useTierList();

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={RankingIcon} size={18} color="var(--color-gold)" strokeWidth={1.5} />
                    <h1 className="text-lg font-bold font-[var(--font-outfit)]">Item Tier List</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Ranked by Win Probability Added (WPA)
                </p>
            </div>

            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2.5">
                            <div className="h-7 w-20 animate-pulse rounded-sm bg-muted" />
                            <div className="grid grid-cols-4 gap-2.5 md:grid-cols-6">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="h-20 animate-pulse rounded-sm bg-muted" />
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
