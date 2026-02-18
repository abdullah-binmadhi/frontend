'use client';

import { useQuizStore } from '@/lib/stores/quiz-store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function QuizStepper() {
    const { currentStep, questions, answers, setAnswer, nextStep, prevStep, runRecommendation } =
        useQuizStore();

    const question = questions[currentStep];
    const selectedAnswer = answers[question.id];
    const isLastQuestion = currentStep === questions.length - 1;
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);
    const progress = ((Object.keys(answers).length) / questions.length) * 100;

    const handleSelect = (option: string) => {
        setAnswer(question.id, option);
        // Auto-advance after a brief delay (except on last question)
        if (!isLastQuestion) {
            setTimeout(() => nextStep(), 350);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        Question {currentStep + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-medium text-gold">
                        {Math.round(progress)}% complete
                    </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                </div>
                {/* Step dots */}
                <div className="flex gap-1 mt-3 justify-center">
                    {questions.map((q, i) => (
                        <button
                            key={q.id}
                            onClick={() => useQuizStore.getState().goToStep(i)}
                            className={cn(
                                'h-2 rounded-full transition-all duration-300 cursor-pointer',
                                i === currentStep
                                    ? 'w-6 bg-gold'
                                    : answers[q.id]
                                        ? 'w-2 bg-gold/50'
                                        : 'w-2 bg-muted-foreground/30'
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* Dimension badge */}
                    {question.dimension && (
                        <div className="mb-3">
                            <span className="inline-block rounded-full bg-lol-blue/10 px-3 py-1 text-[11px] font-medium text-lol-blue">
                                {question.dimension}
                            </span>
                        </div>
                    )}

                    {/* Question text */}
                    <h2 className="text-2xl font-bold text-foreground font-[var(--font-outfit)] mb-6 leading-tight">
                        {question.text}
                    </h2>

                    {/* Options grid */}
                    <div className="grid gap-3">
                        {question.options.map((option) => {
                            const isSelected = selectedAnswer === option;
                            return (
                                <motion.button
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={cn(
                                        'group relative w-full rounded-lg border px-5 py-4 text-left text-sm font-medium transition-all duration-200',
                                        isSelected
                                            ? 'border-gold bg-gold/10 text-gold shadow-[0_0_20px_rgba(200,170,110,0.15)]'
                                            : 'border-border bg-card text-foreground hover:border-gold/40 hover:bg-muted/50'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Radio indicator */}
                                        <div
                                            className={cn(
                                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                                                isSelected
                                                    ? 'border-gold bg-gold'
                                                    : 'border-muted-foreground/40 group-hover:border-gold/60'
                                            )}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="h-2 w-2 rounded-full bg-navy"
                                                />
                                            )}
                                        </div>
                                        <span>{option}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={cn(
                        'rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
                        currentStep === 0
                            ? 'text-muted-foreground/40 cursor-not-allowed'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                >
                    ← Previous
                </button>

                {isLastQuestion ? (
                    <motion.button
                        onClick={runRecommendation}
                        disabled={!allAnswered}
                        whileHover={{ scale: allAnswered ? 1.03 : 1 }}
                        whileTap={{ scale: allAnswered ? 0.97 : 1 }}
                        className={cn(
                            'rounded-lg px-8 py-3 text-sm font-bold transition-all',
                            allAnswered
                                ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-navy shadow-lg shadow-gold/20 hover:shadow-gold/40'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        )}
                    >
                        ✨ Get Recommendations
                    </motion.button>
                ) : (
                    <button
                        onClick={nextStep}
                        className="rounded-lg px-5 py-2.5 text-sm font-medium text-gold hover:bg-gold/10 transition-colors"
                    >
                        Next →
                    </button>
                )}
            </div>
        </div>
    );
}
