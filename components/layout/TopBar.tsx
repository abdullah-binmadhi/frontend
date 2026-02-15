'use client';

import { useTheme } from 'next-themes';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sun01Icon, Moon01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TopBar() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-5 backdrop-blur-sm">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.5} />
                </div>
                <Input
                    placeholder="Search champions, items, builds…"
                    className="h-8 bg-muted/50 pl-9 text-sm border-border/50 focus:border-primary/40 focus:ring-primary/20"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <span className="dark:hidden">
                        <HugeiconsIcon icon={Sun01Icon} size={16} strokeWidth={1.5} />
                    </span>
                    <span className="hidden dark:inline">
                        <HugeiconsIcon icon={Moon01Icon} size={16} strokeWidth={1.5} />
                    </span>
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-primary/25 text-primary hover:bg-primary/10 text-xs"
                >
                    Sign In
                </Button>
            </div>
        </header>
    );
}
