'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TopBar() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
            {/* Search */}
            <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search champions, items, builds..."
                    className="h-9 bg-muted/50 pl-9 text-sm border-border/50 focus:border-gold/50 focus:ring-gold/20"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gold/30 text-gold hover:bg-gold/10 text-xs"
                >
                    Sign In
                </Button>
            </div>
        </header>
    );
}
