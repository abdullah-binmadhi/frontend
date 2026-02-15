'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Trophy, Swords, Shield, ListOrdered, Wrench } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
    { href: '/champions', label: 'Champions', icon: Swords },
    { href: '/items', label: 'Items', icon: Shield },
    { href: '/tier-list', label: 'Tier List', icon: ListOrdered },
    { href: '/builds', label: 'Builds', icon: Wrench },
];

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-card p-0">
                    <div className="flex h-16 items-center px-6">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                            <Trophy className="h-6 w-6 text-gold" />
                            <span className="text-lg font-bold text-gold-gradient">BuildOpt</span>
                        </Link>
                    </div>
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-gold/10 text-gold'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
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
