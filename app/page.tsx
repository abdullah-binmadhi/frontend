'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ChampionIcon,
  RankingIcon,
  Configuration01Icon,
  BarChartIcon,
  Sword01Icon,
  FlashIcon,
  ArrowRight01Icon,
  AiNetworkIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: RankingIcon,
    title: 'Item Tier Lists',
    desc: 'WPA-ranked items — see what wins in your situation.',
  },
  {
    icon: Configuration01Icon,
    title: 'Build Optimizer',
    desc: 'Recommendations tuned to enemy comp and game state.',
  },
  {
    icon: BarChartIcon,
    title: 'Win Probability',
    desc: 'See how win% shifts — and where games are actually won.',
  },
  {
    icon: Sword01Icon,
    title: 'Champion Analytics',
    desc: 'Matchups, power spikes, and counters at a glance.',
  },
  {
    icon: AiNetworkIcon,
    title: 'Champion Recommender',
    desc: 'Take a quiz and let our ML ensemble find your perfect champion match.',
    href: '/recommend',
  },
];

const stats = [
  { value: '500K+', label: 'Matches Analyzed' },
  { value: '160+', label: 'Champions' },
  { value: '<2s', label: 'Load Time' },
  { value: '99.9%', label: 'Uptime' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,170,110,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,170,110,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-gold/20 bg-gold/5 px-2.5 py-0.5 text-xs font-medium text-gold">
              <HugeiconsIcon icon={FlashIcon} size={12} strokeWidth={1.5} />
              ML-Powered Analytics
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl font-[var(--font-outfit)]">
              Win more with{' '}
              <span className="text-gold-gradient">data-driven</span>{' '}
              builds
            </h1>

            <p className="mt-4 max-w-lg text-base text-muted-foreground leading-relaxed">
              BuildOpt crunches 500K+ matches so you know exactly which items
              to build — for any comp, any game state.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href="/tier-list">
                <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold gap-1.5 h-9 text-sm">
                  View Tier Lists
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={1.5} />
                </Button>
              </Link>
              <Link href="/champions">
                <Button variant="outline" className="border-primary/25 text-foreground hover:bg-primary/5 gap-1.5 h-9 text-sm">
                  <HugeiconsIcon icon={ChampionIcon} size={15} strokeWidth={1.5} />
                  Explore Champions
                </Button>
              </Link>
              <Link href="/recommend">
                <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 gap-1.5 h-9 text-sm">
                  <HugeiconsIcon icon={AiNetworkIcon} size={15} strokeWidth={1.5} />
                  Find My Champion
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-gold md:text-2xl font-[var(--font-outfit)]">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <h2 className="text-xl font-bold md:text-2xl font-[var(--font-outfit)]">
            Tools that <span className="text-gold-gradient">win games</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Built on real match data
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const inner = (
              <div
                className="group rounded-sm border border-border bg-card p-4 transition-colors duration-150 hover:border-primary/20 h-full"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold/10 text-gold transition-colors group-hover:bg-gold/15">
                  <HugeiconsIcon icon={feature.icon} size={18} strokeWidth={1.5} />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
            return (feature as any).href ? (
              <Link key={feature.title} href={(feature as any).href}>{inner}</Link>
            ) : (
              <div key={feature.title}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <h2 className="text-xl font-bold md:text-2xl font-[var(--font-outfit)]">
            Start winning smarter
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Free. No signup required.
          </p>
          <Link href="/tier-list" className="mt-5 inline-block">
            <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold gap-1.5 px-6 h-9 text-sm">
              Get Started
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={ChampionIcon} size={15} color="var(--color-gold)" strokeWidth={1.5} />
              <span>BuildOpt</span>
              <span>·</span>
              <span>© 2025</span>
            </div>
            <div className="flex gap-5 text-xs text-muted-foreground">
              <Link href="/tier-list" className="hover:text-foreground transition-colors">Tier Lists</Link>
              <Link href="/champions" className="hover:text-foreground transition-colors">Champions</Link>
              <Link href="/recommend" className="hover:text-foreground transition-colors">Recommender</Link>
              <Link href="/items" className="hover:text-foreground transition-colors">Items</Link>
              <Link href="/builds" className="hover:text-foreground transition-colors">Builds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
