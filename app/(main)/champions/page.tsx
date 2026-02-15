'use client';

import { ChampionGrid } from '@/components/champion/ChampionGrid';
import { useChampions } from '@/lib/hooks/useChampions';
import { Swords } from 'lucide-react';

export default function ChampionsPage() {
    const { data: champions, isLoading } = useChampions();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-gold" />
                    <h1 className="text-xl font-bold font-[var(--font-outfit)]">Champions</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Browse champion analytics, win rates, and recommended builds
                </p>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-square animate-pulse rounded-sm bg-muted" />
                    ))}
                </div>
            )}

            {/* Grid */}
            {champions && <ChampionGrid champions={champions} />}
        </div>
    );
}
