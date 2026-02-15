'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Champion } from '@/lib/types';

interface ChampionCardProps {
    champion: Champion;
}

export function ChampionCard({ champion }: ChampionCardProps) {
    return (
        <Link
            href={`/champions/${champion.id}`}
            className="group relative block overflow-hidden rounded-sm border border-border bg-card transition-colors duration-150 hover:border-primary/25"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
                <Image
                    src={champion.imageUrl}
                    alt={champion.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 120px"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>

            {/* Info */}
            <div className="p-2.5">
                <h3 className="text-xs font-semibold truncate">{champion.name}</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                    {champion.tags.slice(0, 2).map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
                {champion.stats && (
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className={champion.stats.winRate >= 0.5 ? 'text-signal-green' : 'text-signal-red'}>
                            {(champion.stats.winRate * 100).toFixed(1)}% WR
                        </span>
                        <span>{(champion.stats.pickRate * 100).toFixed(1)}% PR</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
