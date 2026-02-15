'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Trophy,
  Swords,

  ListOrdered,
  Wrench,

  Zap,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: ListOrdered,
    title: 'Item Tier Lists',
    desc: 'WPA-ranked items showing what actually wins games in your situation.',
  },
  {
    icon: Wrench,
    title: 'Build Optimizer',
    desc: 'AI-powered build recommendations based on enemy comp and game state.',
  },
  {
    icon: BarChart3,
    title: 'Win Probability',
    desc: 'Track win% swings and identify the plays that matter most.',
  },
  {
    icon: Swords,
    title: 'Champion Analytics',
    desc: 'Matchup data, power spikes, and counter picks for every champion.',
  },
];

const stats = [
  { value: '500K+', label: 'Matches Analyzed' },
  { value: '160+', label: 'Champions' },
  { value: '<2s', label: 'Load Time' },
  { value: '99.9%', label: 'Uptime' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,170,110,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,170,110,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-36">
          <motion.div
            className="max-w-3xl"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.div
              variants={fadeUp}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <span className="inline-flex items-center gap-2 rounded-sm border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">
                <Zap className="h-3 w-3" />
                ML-Powered Analytics
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
              className="mt-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl font-[var(--font-outfit)]"
            >
              Win more with{' '}
              <span className="text-gold-gradient">data-driven</span>{' '}
              builds
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              Stop guessing. BuildOpt analyzes 500K+ matches to show you exactly
              which items give you the best chance to win — in every situation.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/tier-list">
                <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold gap-2">
                  View Tier Lists
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/champions">
                <Button variant="outline" className="border-gold/30 text-foreground hover:bg-gold/5 gap-2">
                  <Trophy className="h-4 w-4" />
                  Explore Champions
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-gold md:text-3xl font-[var(--font-outfit)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold md:text-3xl font-[var(--font-outfit)]">
            Everything you need to <span className="text-gold-gradient">climb</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Powered by machine learning and real match data
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group rounded-sm border border-border bg-card p-6 transition-colors hover:border-gold/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold md:text-3xl font-[var(--font-outfit)]">
              Ready to optimize your builds?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands of players making smarter decisions every game.
            </p>
            <Link href="/tier-list" className="mt-6 inline-block">
              <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold gap-2 px-8">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-gold" />
              <span>BuildOpt</span>
              <span>·</span>
              <span>© 2025</span>
            </div>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <Link href="/tier-list" className="hover:text-foreground transition-colors">Tier Lists</Link>
              <Link href="/champions" className="hover:text-foreground transition-colors">Champions</Link>
              <Link href="/items" className="hover:text-foreground transition-colors">Items</Link>
              <Link href="/builds" className="hover:text-foreground transition-colors">Builds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
