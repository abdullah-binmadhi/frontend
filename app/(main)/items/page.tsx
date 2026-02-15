'use client';

import { useItems } from '@/lib/hooks/useItems';
import { useState, useMemo } from 'react';
import { Shield, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Item } from '@/lib/types';

const ITEM_CATEGORIES = ['All', 'Damage', 'AttackSpeed', 'SpellDamage', 'Health', 'Armor', 'CriticalStrike'];

export default function ItemsPage() {
    const { data: items, isLoading } = useItems();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = useMemo(() => {
        if (!items) return [];
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchesCat = category === 'All' || item.tags.includes(category);
            return matchesSearch && matchesCat;
        });
    }, [items, search, category]);

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gold" />
                    <h1 className="text-xl font-bold font-[var(--font-outfit)]">Items</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Browse all items with cost, stats, and build paths
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative max-w-xs flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 bg-muted/50 pl-9 text-sm"
                    />
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
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="aspect-square animate-pulse rounded-sm bg-muted" />
                    ))}
                </div>
            )}

            {/* Grid */}
            {filtered && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {filtered.map((item, i) => (
                        <ItemGridCard key={item.id} item={item} index={i} />
                    ))}
                </div>
            )}

            {filtered.length === 0 && !isLoading && (
                <div className="py-12 text-center text-muted-foreground">No items found</div>
            )}
        </div>
    );
}

function ItemGridCard({ item, index }: { item: Item; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, type: 'spring', stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
        >
            <Link
                href={`/items/${item.id}`}
                className="flex flex-col items-center gap-2 rounded-sm border border-border bg-card p-3 transition-colors hover:border-gold/30"
            >
                <div className="relative h-12 w-12">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="rounded-sm object-cover" />
                </div>
                <span className="text-[11px] font-medium text-center leading-tight line-clamp-2">{item.name}</span>
                <span className="text-[10px] text-gold">{item.totalCost}g</span>
            </Link>
        </motion.div>
    );
}
