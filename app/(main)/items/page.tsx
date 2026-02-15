'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Role, Item } from '@/lib/types';

import { useItems } from '@/lib/hooks/useItems';
import { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Shield01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

const ITEM_CATEGORIES = ['All', 'Damage', 'AttackSpeed', 'SpellDamage', 'Health', 'Armor', 'CriticalStrike'];

type ItemCategory = 'Starter' | 'Boots' | 'Component' | 'Legendary';

function getItemCategory(item: Item): ItemCategory {
    if (item.tags.includes('Boots')) return 'Boots';

    const lowerName = item.name.toLowerCase();
    // Consumables & Starters
    if (
        lowerName.includes('doran') || lowerName.includes('cull') || lowerName.includes('dark seal') ||
        lowerName.includes('world atlas') || lowerName.includes('potion') || lowerName.includes('ward') ||
        lowerName.includes('elixir') || lowerName.includes('biscuit') ||
        lowerName.includes('scorchclaw') || lowerName.includes('gustwalker') || lowerName.includes('mosstomper')
    ) {
        return 'Starter';
    }

    // Components (builds into something)
    // Exception: Tier 2 boots are boots, handled above.
    if (item.buildsInto && item.buildsInto.length > 0) return 'Component';

    return 'Legendary';
}

export default function ItemsPage() {
    const { data: items, isLoading } = useItems();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [role, setRole] = useState<Role | 'All'>('All');

    const sections = useMemo(() => {
        if (!items) return { Starter: [], Boots: [], Component: [], Legendary: [] };

        const filtered = items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchesCat = category === 'All' || item.tags.includes(category);
            const matchesRole = role === 'All' || (item.roles && item.roles.includes(role));
            return matchesSearch && matchesCat && matchesRole;
        });

        const grouped: Record<ItemCategory, Item[]> = {
            Starter: [],
            Boots: [],
            Component: [],
            Legendary: []
        };

        filtered.forEach(item => {
            grouped[getItemCategory(item)].push(item);
        });

        return grouped;
    }, [items, search, category, role]);

    const hasAnyItems = Object.values(sections).some(arr => arr.length > 0);

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Shield01Icon} size={18} color="var(--color-gold)" strokeWidth={1.5} />
                    <h1 className="text-lg font-bold font-[var(--font-outfit)]">Items</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Browse all items — categorized by type
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative max-w-xs flex-1 sm:flex-initial sm:w-[240px]">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.5} />
                        </div>
                        <Input
                            placeholder="Find an item…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 bg-muted/50 pl-9 text-sm"
                        />
                    </div>

                    <Select value={role} onValueChange={(v) => setRole(v as Role | 'All')}>
                        <SelectTrigger className="h-9 w-full sm:w-[140px] bg-muted/50 text-sm">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Roles</SelectItem>
                            <SelectItem value="Top">Top</SelectItem>
                            <SelectItem value="Jungle">Jungle</SelectItem>
                            <SelectItem value="Mid">Mid</SelectItem>
                            <SelectItem value="ADC">ADC</SelectItem>
                            <SelectItem value="Support">Support</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {ITEM_CATEGORIES.map((cat) => (
                        <Badge
                            key={cat}
                            variant={category === cat ? 'default' : 'outline'}
                            className={`cursor-pointer text-xs transition-colors ${category === cat ? 'bg-gold text-navy hover:bg-gold/90' : 'hover:bg-muted'
                                }`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat === 'SpellDamage' ? 'AP' : cat === 'AttackSpeed' ? 'AS' : cat === 'CriticalStrike' ? 'Crit' : cat}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="aspect-square animate-pulse rounded-sm bg-muted" />
                    ))}
                </div>
            )}

            {/* Valid Content */}
            {!isLoading && hasAnyItems && (
                <div className="space-y-8">
                    {sections.Starter.length > 0 && (
                        <ItemSection title="Starter & Consumables" items={sections.Starter} />
                    )}
                    {sections.Boots.length > 0 && (
                        <ItemSection title="Boots" items={sections.Boots} />
                    )}
                    {sections.Component.length > 0 && (
                        <ItemSection title="Components" items={sections.Component} />
                    )}
                    {sections.Legendary.length > 0 && (
                        <ItemSection title="Legendaries & Mythics" items={sections.Legendary} />
                    )}
                </div>
            )}

            {!isLoading && !hasAnyItems && (
                <div className="py-10 text-center text-sm text-muted-foreground">No items found</div>
            )}
        </div>
    );
}

function ItemSection({ title, items }: { title: string, items: Item[] }) {
    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground/90 border-b border-border/50 pb-1">{title}</h2>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {items.map((item) => (
                    <ItemGridCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

function ItemGridCard({ item }: { item: Item }) {
    return (
        <Link
            href={`/items/${item.id}`}
            className="flex flex-col items-center gap-1.5 rounded-sm border border-border bg-card p-2.5 transition-colors duration-150 hover:border-primary/25"
        >
            <div className="relative h-11 w-11">
                <Image src={item.imageUrl} alt={item.name} fill sizes="44px" className="rounded-sm object-cover" />
            </div>
            <span className="text-[11px] font-medium text-center leading-tight line-clamp-2">{item.name}</span>
            <span className="text-[10px] text-gold">{item.totalCost}g</span>
        </Link>
    );
}
