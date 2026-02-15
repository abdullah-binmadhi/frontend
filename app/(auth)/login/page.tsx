'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="mb-8 text-center">
                <Link href="/" className="inline-flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-gold" />
                    <span className="text-2xl font-bold text-gold-gradient font-[var(--font-outfit)]">BuildOpt</span>
                </Link>
            </div>
            <Card className="border-border bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-lg">Welcome back</CardTitle>
                    <p className="text-sm text-muted-foreground">Sign in to your account</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Email</Label>
                        <Input type="email" placeholder="you@example.com" className="bg-muted/50 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Password</Label>
                        <Input type="password" placeholder="••••••••" className="bg-muted/50 text-sm" />
                    </div>
                    <Button className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold">Sign In</Button>
                    <p className="text-center text-xs text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-gold hover:underline">Sign up</Link>
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
