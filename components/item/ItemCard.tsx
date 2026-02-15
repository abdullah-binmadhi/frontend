'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TierListEntry } from '@/lib/types';

interface ItemCardProps {
    entry: TierListEntry;
    index?: number;
    showWpa?: boolean;
}

const tierColors: Record<string, string> = {
    S: 'bg-tier-s text-white',
    A: 'bg-signal-green text-navy',
    B: 'bg-lol-blue text-navy',
    C: 'bg-tier-c text-white',
};

export function ItemCard({ entry, index = 0, showWpa = true }: ItemCardProps) {
    const { item, tier, wpa, winRate, pickRate, gamesPlayed } = entry;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, type: 'spring', stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="relative flex flex-col items-center gap-2 rounded-sm border border-border bg-card p-3 transition-colors hover:border-gold/30 cursor-pointer">
                        {/* Tier badge */}
                        <Badge className={`absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0 h-4 ${tierColors[tier]}`}>
                            {tier}
                        </Badge>

                        {/* Item image */}
                        <div className="relative h-12 w-12">
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="rounded-sm object-cover"
                            />
                        </div>

                        {/* Item name */}
                        <span className="text-[11px] font-medium text-center leading-tight line-clamp-2">
                            {item.name}
                        </span>

                        {/* WPA */}
                        {showWpa && (
                            <span
                                className={`text-[11px] font-bold ${wpa >= 0 ? 'text-signal-green' : 'text-signal-red'
                                    }`}
                            >
                                {wpa >= 0 ? '+' : ''}{(wpa * 100).toFixed(1)}% WPA
                            </span>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-1 text-xs">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-muted-foreground">{item.description}</p>
                        <div className="flex gap-3 pt-1">
                            <span>WR: <b className="text-signal-green">{(winRate * 100).toFixed(1)}%</b></span>
                            <span>PR: <b>{(pickRate * 100).toFixed(1)}%</b></span>
                            <span>Games: <b>{(gamesPlayed / 1000).toFixed(0)}K</b></span>
                        </div>
                        <p className="text-gold">Cost: {item.totalCost}g</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </motion.div>
    );
}
