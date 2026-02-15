'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Swords,
    Shield,
    Trophy,
    ListOrdered,
    Wrench,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
    { href: '/champions', label: 'Champions', icon: Swords },
    { href: '/items', label: 'Items', icon: Shield },
    { href: '/tier-list', label: 'Tier List', icon: ListOrdered },
    { href: '/builds', label: 'Builds', icon: Wrench },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 64 : 240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card"
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4">
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Link href="/" className="flex items-center gap-2">
                                <Trophy className="h-6 w-6 text-gold" />
                                <span className="text-lg font-bold text-gold-gradient font-[var(--font-outfit)]">
                                    BuildOpt
                                </span>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
                {collapsed && (
                    <Link href="/" className="mx-auto">
                        <Trophy className="h-6 w-6 text-gold" />
                    </Link>
                )}
            </div>

            <Separator className="opacity-30" />

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors duration-150',
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
                            <item.icon className="h-4 w-4 shrink-0" />
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

            {/* Collapse button */}
            <div className="p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full justify-center text-muted-foreground hover:text-foreground"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </motion.aside>
    );
}
