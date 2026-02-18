'use client';

import { useEffect } from 'react';
import { useQuizStore } from '@/lib/stores/quiz-store';
import { QuizStepper } from '@/components/recommend/QuizStepper';
import { ResultsView } from '@/components/recommend/ResultsView';
import { MetricsPanel } from '@/components/recommend/MetricsPanel';
import { motion, AnimatePresence } from 'framer-motion';

function LoadingState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32"
        >
            {/* Animated rings */}
            <div className="relative mb-6">
                <motion.div
                    className="h-20 w-20 rounded-full border-2 border-gold/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute inset-1 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                    className="absolute inset-3 rounded-full border-2 border-b-lol-blue border-r-transparent border-t-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🧠</span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-foreground font-[var(--font-outfit)] mb-1">
                Analyzing Your Preferences
            </h3>
            <p className="text-sm text-muted-foreground">
                Running 3 ML algorithms across 160+ champions...
            </p>

            {/* Algorithm status */}
            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
                {['Random Forest (10 trees)', 'Decision Tree (rule-based)', 'KNN (distance-based)'].map(
                    (algo, i) => (
                        <motion.div
                            key={algo}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                className="h-1.5 w-1.5 rounded-full bg-gold"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                            />
                            {algo}
                        </motion.div>
                    )
                )}
            </div>
        </motion.div>
    );
}

export default function RecommendPage() {
    const { phase, enrichmentStatus, isEnriching, loadEnrichment } = useQuizStore();

    // Load enrichment on mount (fetches live Riot API data in background)
    useEffect(() => {
        loadEnrichment();
    }, [loadEnrichment]);

    return (
        <div className="min-h-[calc(100vh-8rem)]">
            {/* Page header (only shown during quiz) */}
            {phase === 'quiz' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl font-bold text-gold-gradient font-[var(--font-outfit)] mb-2">
                        Champion Recommender
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                        Answer 12 questions about your playstyle and preferences. Our ML ensemble will analyze
                        160+ champions to find your perfect match.
                    </p>

                    {/* Live data status indicator */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                        {isEnriching ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <motion.div
                                    className="h-1.5 w-1.5 rounded-full bg-yellow-400"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                Loading live Riot data...
                            </div>
                        ) : enrichmentStatus.isLive ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Live Data · Patch {enrichmentStatus.patchVersion}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                                Offline Data
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {phase === 'quiz' && (
                    <motion.div key="quiz" exit={{ opacity: 0, y: -20 }}>
                        <QuizStepper />
                    </motion.div>
                )}

                {phase === 'loading' && (
                    <motion.div key="loading" exit={{ opacity: 0 }}>
                        <LoadingState />
                    </motion.div>
                )}

                {phase === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <ResultsView />
                        <MetricsPanel />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
