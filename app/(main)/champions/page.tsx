'use client';

import { ChampionGrid } from '@/components/champion/ChampionGrid';
import { useChampions } from '@/lib/hooks/useChampions';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sword01Icon } from '@hugeicons/core-free-icons';

export default function ChampionsPage() {
    const { data: champions, isLoading } = useChampions();

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Sword01Icon} size={18} color="var(--color-gold)" strokeWidth={1.5} />
                    <h1 className="text-lg font-bold font-[var(--font-outfit)]">Champions</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Win rates, matchups, and top builds
                </p>
            </div>

            {isLoading && (
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-square animate-pulse rounded-sm bg-muted" />
                    ))}
                </div>
            )}

            {champions && <ChampionGrid champions={champions} />}
        </div>
    );
}
