'use client';

import { useBuilds } from '@/lib/hooks/useBuilds';
import { Build } from '@/lib/types';
import { BuildPreview } from '@/components/build/BuildPreview';
import { HugeiconsIcon } from '@hugeicons/react';
import { Configuration01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BuildsPage() {
    const { data: builds, isLoading } = useBuilds();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Configuration01Icon} size={18} color="var(--color-gold)" strokeWidth={1.5} />
                        <h1 className="text-lg font-bold font-[var(--font-outfit)]">Builds</h1>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Community builds and optimized recommendations
                    </p>
                </div>
                <Link href="/builds/create">
                    <Button className="bg-gold text-navy hover:bg-gold/90 text-xs font-semibold h-8">
                        Create Build
                    </Button>
                </Link>
            </div>

            {isLoading && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-40 animate-pulse rounded-sm bg-muted" />
                    ))}
                </div>
            )}

            {builds && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {builds.map((build: Build) => (
                        <BuildPreview key={build.id} build={build} />
                    ))}
                </div>
            )}
        </div>
    );
}
