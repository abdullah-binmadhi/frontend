'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Sword01Icon,
    Shield01Icon,
    ChampionIcon,
    RankingIcon,
    Configuration01Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    SparklesIcon,
} from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
    { href: '/champions', label: 'Champions', icon: Sword01Icon },
    { href: '/items', label: 'Items', icon: Shield01Icon },
    { href: '/tier-list', label: 'Tier List', icon: RankingIcon },
    { href: '/builds', label: 'Builds', icon: Configuration01Icon },
    { href: '/recommend', label: 'Recommend', icon: SparklesIcon },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 56 : 220 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card"
        >
            {/* Logo */}
            <div className="flex h-14 items-center justify-between px-3">
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Link href="/" className="flex items-center gap-2">
                                <HugeiconsIcon icon={ChampionIcon} size={20} color="var(--color-gold)" strokeWidth={1.5} />
                                <span className="text-base font-bold text-gold-gradient font-[var(--font-outfit)]">
                                    BuildOpt
                                </span>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
                {collapsed && (
                    <Link href="/" className="mx-auto">
                        <HugeiconsIcon icon={ChampionIcon} size={20} color="var(--color-gold)" strokeWidth={1.5} />
                    </Link>
                )}
            </div>

            <Separator className="opacity-30" />

            {/* Navigation */}
            <nav className="flex-1 space-y-0.5 p-2">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group relative flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-150',
                                isActive
                                    ? 'bg-gold/10 text-gold'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-0 h-full w-0.5 rounded-r bg-gold"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.5} />
                            <AnimatePresence mode="wait">
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            <Separator className="opacity-30" />

            {/* Collapse */}
            <div className="p-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full justify-center text-muted-foreground hover:text-foreground"
                >
                    <HugeiconsIcon icon={collapsed ? ArrowRight01Icon : ArrowLeft01Icon} size={16} strokeWidth={1.5} />
                </Button>
            </div>
        </motion.aside>
    );
}
