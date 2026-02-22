'use client';

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Menu01Icon,
    ChampionIcon,
    Sword01Icon,
    Shield01Icon,
    RankingIcon,
    Configuration01Icon,
    SparklesIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
    { href: '/champions', label: 'Champions', icon: Sword01Icon },
    { href: '/items', label: 'Items', icon: Shield01Icon },
    { href: '/tier-list', label: 'Tier List', icon: RankingIcon },
    { href: '/builds', label: 'Builds', icon: Configuration01Icon },
    { href: '/recommend', label: 'Recommend', icon: SparklesIcon },
];

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="fixed left-3 top-3 z-50">
                        <HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={1.5} />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-56 bg-card p-0">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                        Mobile navigation menu for accessing different sections of the application.
                    </SheetDescription>
                    <div className="flex h-14 items-center px-5">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                            <HugeiconsIcon icon={ChampionIcon} size={20} color="var(--color-gold)" strokeWidth={1.5} />
                            <span className="text-base font-bold text-gold-gradient">BuildOpt</span>
                        </Link>
                    </div>
                    <nav className="space-y-0.5 px-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-gold/10 text-gold'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.5} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}
