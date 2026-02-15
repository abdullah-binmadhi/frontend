'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChampionIcon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div>
            <div className="mb-6 text-center">
                <Link href="/" className="inline-flex items-center gap-2">
                    <HugeiconsIcon icon={ChampionIcon} size={24} color="var(--color-gold)" strokeWidth={1.5} />
                    <span className="text-xl font-bold text-gold-gradient font-[var(--font-outfit)]">BuildOpt</span>
                </Link>
            </div>
            <Card className="border-border bg-card">
                <CardHeader className="text-center pb-3">
                    <CardTitle className="text-base">Create account</CardTitle>
                    <p className="text-sm text-muted-foreground">Start tracking and optimizing your builds</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Username</Label>
                        <Input placeholder="Summoner name" className="h-8 bg-muted/50 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Email</Label>
                        <Input type="email" placeholder="you@example.com" className="h-8 bg-muted/50 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Password</Label>
                        <Input type="password" placeholder="••••••••" className="h-8 bg-muted/50 text-sm" />
                    </div>
                    <Button className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold h-9">Create Account</Button>
                    <p className="text-center text-xs text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold hover:underline">Sign in</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
