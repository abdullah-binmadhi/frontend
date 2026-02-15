'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { ChampionCard } from './ChampionCard';
import { Champion } from '@/lib/types';

const ROLE_FILTERS = ['All', 'Fighter', 'Mage', 'Assassin', 'Marksman', 'Tank', 'Support'];

interface ChampionGridProps {
    champions: Champion[];
}

export function ChampionGrid({ champions }: ChampionGridProps) {
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');

    const filtered = useMemo(() => {
        return champions.filter((c) => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
            const matchesRole = selectedRole === 'All' || c.tags.includes(selectedRole);
            return matchesSearch && matchesRole;
        });
    }, [champions, search, selectedRole]);

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative max-w-xs flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.5} />
                    </div>
                    <Input
                        placeholder="Find a champion…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 bg-muted/50 pl-9 text-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {ROLE_FILTERS.map((role) => (
                        <Badge
                            key={role}
                            variant={selectedRole === role ? 'default' : 'outline'}
                            className={`cursor-pointer text-xs transition-colors ${selectedRole === role
                                ? 'bg-gold text-navy hover:bg-gold/90'
                                : 'hover:bg-muted'
                                }`}
                            onClick={() => setSelectedRole(role)}
                        >
                            {role}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                {filtered.map((champion) => (
                    <ChampionCard key={champion.id} champion={champion} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                    No champions match &ldquo;{search}&rdquo;
                </div>
            )}
        </div>
    );
}
