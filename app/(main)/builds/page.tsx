'use client';

import { useBuilds } from '@/lib/hooks/useBuilds';
import { BuildPreview } from '@/components/build/BuildPreview';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BuildsPage() {
    const { data: builds, isLoading } = useBuilds();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-gold" />
                        <h1 className="text-xl font-bold font-[var(--font-outfit)]">Builds</h1>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Community-created builds and AI-optimized recommendations
                    </p>
                </div>
                <Link href="/builds/create">
                    <Button className="bg-gold text-navy hover:bg-gold/90 text-xs font-semibold">
                        Create Build
                    </Button>
                </Link>
            </div>

            {isLoading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-48 animate-pulse rounded-sm bg-muted" />
                    ))}
                </div>
            )}

            {builds && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {builds.map((build, i) => (
                        <BuildPreview key={build.id} build={build} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
