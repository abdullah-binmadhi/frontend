'use client';

import { useMemo, useState } from 'react';
import { TierListEntry } from '@/lib/types';
import { WPABar } from '@/components/charts/WPABar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ItemTierListProps {
    entries: TierListEntry[];
}

type Category = 'All' | 'Legendaries' | 'Components' | 'Boots' | 'Support' | 'Starter';
type SlotFilter = 'All' | '1st' | '2nd' | '3rd' | '4th+';
type RoleFilter = 'All' | 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support';

const CATEGORIES: Category[] = ['Legendaries', 'Components', 'Boots', 'Support', 'Starter'];
const SLOTS: SlotFilter[] = ['All', '1st', '2nd', '3rd', '4th+'];
const ROLES: RoleFilter[] = ['All', 'Top', 'Jungle', 'Mid', 'ADC', 'Support'];

export function ItemTierList({ entries }: ItemTierListProps) {
    const [category, setCategory] = useState<Category>('Legendaries');
    const [slot, setSlot] = useState<SlotFilter>('All');
    const [role, setRole] = useState<RoleFilter>('All');

    // Currently mocked dynamic filtering processing
    const filteredEntries = useMemo(() => {
        // Here we would filter the `entries` array by the active state variables
        // if the upstream data supports it. For now, we simulate sorting by WPA descended.
        return [...entries].sort((a, b) => b.wpa - a.wpa);
    }, [entries, category, slot, role]);

    return (
        <div className="space-y-6">
            {/* Multi-Tier Filtering Header */}
            <div className="flex flex-col gap-4">

                {/* Top Row: Categories + Slot Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-1 bg-muted/20 p-1 rounded-md border border-border/40">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${category === cat ? 'bg-muted/80 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-1 bg-muted/20 p-1 rounded-md border border-border/40">
                        {SLOTS.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSlot(s)}
                                className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${slot === s ? 'bg-muted/80 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secondary Row: Roles */}
                <div className="flex gap-2">
                    {ROLES.map((r) => (
                        <Badge
                            key={r}
                            variant={role === r ? 'default' : 'outline'}
                            onClick={() => setRole(r)}
                            className={`cursor-pointer ${role === r ? 'bg-gold text-navy hover:bg-gold/90' : 'hover:bg-muted font-normal'}`}
                        >
                            {r}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* High-Density Data Table */}
            <div className="rounded-md border border-border/40 bg-card overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/20 text-xs text-muted-foreground border-b border-border/40 uppercase tracking-wide">
                        <tr>
                            <th className="px-4 py-3 font-medium">Item</th>
                            <th className="px-4 py-3 font-medium text-center" colSpan={2}>Win Probability Added (%pt.)</th>
                            <th className="px-4 py-3 font-medium text-center" colSpan={2}>Frequency</th>
                            <th className="px-4 py-3 font-medium text-center" colSpan={2}>Baseline & Outcome</th>
                        </tr>
                        <tr className="border-b border-border/20 text-[11px] bg-muted/10">
                            <th className="px-4 pb-2 pt-1 font-normal opacity-0">Hidden Spacer</th>
                            <th className="px-4 pb-2 pt-1 font-normal text-center w-[160px]">WPA Bar</th>
                            <th className="px-4 pb-2 pt-1 font-normal text-right w-[80px]">WPA</th>
                            <th className="px-4 pb-2 pt-1 font-normal text-right w-[100px]">Buys</th>
                            <th className="px-4 pb-2 pt-1 font-normal text-right w-[100px]">Pick Rate</th>
                            <th className="px-4 pb-2 pt-1 font-normal text-right w-[120px]">Pre-Buy WP</th>
                            <th className="px-4 pb-2 pt-1 font-normal text-right w-[120px]">Win Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {filteredEntries.map((entry) => {
                            // Derive the Pre-buy Win Probability
                            const preBuyWP = entry.winRate - entry.wpa;

                            return (
                                <tr key={entry.item.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-4 py-2 flex items-center gap-3">
                                        <div className="relative h-8 w-8 rounded-md overflow-hidden border border-border/50 shrink-0">
                                            <Image
                                                src={entry.item.imageUrl}
                                                alt={entry.item.name}
                                                fill sizes="32px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-[13px] text-foreground group-hover:text-gold transition-colors">{entry.item.name}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-center">
                                            <WPABar wpa={entry.wpa} />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {/* WPA is handled inside WPABar text but we could separate it if needed */}
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium text-muted-foreground text-[13px]">
                                        {entry.gamesPlayed.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium text-muted-foreground text-[13px]">
                                        {(entry.pickRate * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium text-muted-foreground text-[13px]">
                                        {(preBuyWP * 100).toFixed(1)}%
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium text-foreground text-[13px]">
                                        {(entry.winRate * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
