import { create } from 'zustand';
import type {
    UserFeatures,
    AggregatedScore,
    QualityMetrics,
    QuizQuestion,
    ChampionDatabase,
    EnrichedChampionDatabase,
    EnrichmentStatus,
} from '@/lib/ml/types';
import { SimpleRandomForest } from '@/lib/ml/RandomForest';
import { SimpleDecisionTree } from '@/lib/ml/DecisionTree';
import { SimpleKNN } from '@/lib/ml/KNN';
import { ScoreAggregator, EvaluationMetrics } from '@/lib/ml/ScoreAggregator';
import { enrichChampionsWithRiotData } from '@/lib/ml/enrichment';

import championsData from '@/lib/ml/data/champions.json';
import questionsData from '@/lib/ml/data/questions.json';

const staticChampions = championsData as ChampionDatabase;
const questions = (questionsData as { questions: QuizQuestion[] }).questions;

// Map quiz answers to UserFeatures object
function mapAnswersToFeatures(answers: Record<number, string>): UserFeatures {
    const playstyle = answers[4] || 'Balanced/Hybrid';

    const playstyleMap: Record<string, { damage: number; toughness: number }> = {
        'High Damage Output': { damage: 8, toughness: 3 },
        'Tanky and Durable': { damage: 4, toughness: 8 },
        'Support Team': { damage: 3, toughness: 5 },
        'Balanced/Hybrid': { damage: 5, toughness: 5 },
    };

    const mapped = playstyleMap[playstyle] || { damage: 5, toughness: 5 };

    return {
        role: answers[2] || 'No Preference',
        difficulty: answers[1] || 'Medium (4-6)',
        damage: mapped.damage,
        toughness: mapped.toughness,
        mobility: 5,
        control: 5,
        utility: 5,
        position: answers[3] || 'Mid',
        playstyle,
        attack_range: answers[5],
        resource_type: answers[6],
        damage_type: answers[7],
        pressure_response: answers[8] || 'Stay calm and strategic',
        aesthetic_preference: answers[9],
        team_contribution: answers[10] || 'Balance between both',
        character_identity: answers[11],
        problem_solving: answers[12] || 'Analyze carefully before acting',
    };
}

export type QuizPhase = 'quiz' | 'loading' | 'results';

interface QuizState {
    // Quiz state
    phase: QuizPhase;
    currentStep: number;
    answers: Record<number, string>;
    questions: QuizQuestion[];

    // Enrichment state
    enrichedChampions: EnrichedChampionDatabase | null;
    enrichmentStatus: EnrichmentStatus;
    isEnriching: boolean;

    // Results
    top10: AggregatedScore[];
    metrics: QualityMetrics | null;
    allScores: Record<string, AggregatedScore>;

    // Actions
    setAnswer: (questionId: number, answer: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    loadEnrichment: () => Promise<void>;
    runRecommendation: () => void;
    reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
    phase: 'quiz',
    currentStep: 0,
    answers: {},
    questions,
    enrichedChampions: null,
    enrichmentStatus: {
        isLive: false,
        patchVersion: null,
        championCount: Object.keys(staticChampions).length,
        freeRotationCount: 0,
        timestamp: null,
        error: null,
    },
    isEnriching: false,
    top10: [],
    metrics: null,
    allScores: {},

    setAnswer: (questionId, answer) => {
        set((state) => ({
            answers: { ...state.answers, [questionId]: answer },
        }));
    },

    nextStep: () => {
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, questions.length - 1),
        }));
    },

    prevStep: () => {
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 0),
        }));
    },

    goToStep: (step) => {
        set({ currentStep: Math.max(0, Math.min(step, questions.length - 1)) });
    },

    loadEnrichment: async () => {
        if (get().enrichedChampions || get().isEnriching) return;
        set({ isEnriching: true });

        try {
            const { champions, status } = await enrichChampionsWithRiotData(staticChampions);
            set({
                enrichedChampions: champions,
                enrichmentStatus: status,
                isEnriching: false,
            });
        } catch {
            set({ isEnriching: false });
        }
    },

    runRecommendation: () => {
        set({ phase: 'loading' });

        setTimeout(() => {
            const { answers, enrichedChampions } = get();
            const features = mapAnswersToFeatures(answers);

            // Use enriched data if available, otherwise static
            const champDB = enrichedChampions || staticChampions;

            // Run all 3 algorithms with the (potentially enriched) champion data
            const rf = new SimpleRandomForest(champDB);
            const dt = new SimpleDecisionTree(champDB);
            const knn = new SimpleKNN(champDB);

            const rfScores = rf.predictAll(features);
            const dtScores = dt.predictAll(features);
            const knnScores = knn.predictAll(features);

            // Aggregate scores
            const aggregated = ScoreAggregator.aggregateScores(rfScores, dtScores, knnScores, champDB);
            const top10 = ScoreAggregator.selectTop10(aggregated, champDB);

            // Calculate quality metrics
            const relevantSet = EvaluationMetrics.calculateUserRelevance(features, champDB, { top10 });
            const recommendedNames = top10.map((c) => c.championName);
            const metrics = EvaluationMetrics.computeAllMetrics(recommendedNames, relevantSet);

            set({
                phase: 'results',
                top10,
                metrics,
                allScores: aggregated,
            });
        }, 800);
    },

    reset: () => {
        set({
            phase: 'quiz',
            currentStep: 0,
            answers: {},
            top10: [],
            metrics: null,
            allScores: {},
        });
    },
}));
