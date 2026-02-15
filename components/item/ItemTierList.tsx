'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from './ItemCard';
import { TierListEntry, Situation } from '@/lib/types';

interface ItemTierListProps {
    entries: TierListEntry[];
}

const situations: { value: Situation; label: string }[] = [
    { value: 'all', label: 'All Games' },
    { value: 'ahead', label: 'When Ahead' },
    { value: 'behind', label: 'When Behind' },
    { value: 'even', label: 'Even Games' },
];

const tierConfig = {
    S: { label: 'S Tier', color: 'bg-tier-s', desc: 'Overpowered — Must Buy' },
    A: { label: 'A Tier', color: 'bg-signal-green', desc: 'Strong Choice' },
    B: { label: 'B Tier', color: 'bg-lol-blue', desc: 'Viable Option' },
    C: { label: 'C Tier', color: 'bg-tier-c', desc: 'Situational' },
};

export function ItemTierList({ entries }: ItemTierListProps) {
    const [situation, setSituation] = useState<Situation>('all');

    const tiers = useMemo(() => {
        const grouped: Record<string, TierListEntry[]> = { S: [], A: [], B: [], C: [] };
        for (const entry of entries) {
            if (grouped[entry.tier]) {
                grouped[entry.tier].push(entry);
            }
        }
        return grouped;
    }, [entries]);

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {situations.map((s) => (
                    <Badge
                        key={s.value}
                        variant={situation === s.value ? 'default' : 'outline'}
                        className={`cursor-pointer text-xs transition-colors ${situation === s.value
                                ? 'bg-gold text-navy hover:bg-gold/90'
                                : 'hover:bg-muted'
                            }`}
                        onClick={() => setSituation(s.value)}
                    >
                        {s.label}
                    </Badge>
                ))}
            </div>

            {/* Tiers */}
            {(Object.entries(tiers) as [string, TierListEntry[]][]).map(
                ([tier, items]) => {
                    const config = tierConfig[tier as keyof typeof tierConfig];
                    if (!items.length) return null;
                    return (
                        <motion.section
                            key={tier}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-sm text-sm font-bold ${config.color} text-white`}
                                >
                                    {tier}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">{config.label}</h3>
                                    <p className="text-xs text-muted-foreground">{config.desc}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                                {items.map((entry, i) => (
                                    <ItemCard key={entry.item.id} entry={entry} index={i} />
                                ))}
                            </div>
                        </motion.section>
                    );
                }
            )}
        </div>
    );
}
