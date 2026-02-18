import type { ChampionData, ChampionDatabase, UserFeatures, ScoreMap } from './types';

const DIFFICULTY_MAP: Record<string, number> = {
    'Easy (1-3)': 2,
    'Medium (4-6)': 5,
    'Hard (7-8)': 7.5,
    'Very Hard (9-10)': 9.5,
};

export class SimpleDecisionTree {
    private championEntries: [string, ChampionData][];

    constructor(champions: ChampionDatabase) {
        this.championEntries = Object.entries(champions);
    }

    predictAll(features: UserFeatures): ScoreMap {
        const scores: ScoreMap = {};
        for (const [name, champion] of this.championEntries) {
            scores[name] = this.calculateChampionScore(features, champion);
        }
        return scores;
    }

    private calculateChampionScore(features: UserFeatures, champion: ChampionData) {
        let score = 0;
        const explanations: string[] = [];

        // 1. Role Match (Primary Split)
        if (features.role === 'No Preference' || features.role === champion.role) {
            score += 30;
            explanations.push(`Matches preferred role (${champion.role})`);
        }

        // 2. Difficulty (Secondary Split)
        if (features.difficulty) {
            const userDiff = this.mapDifficulty(features.difficulty);
            const diffDist = Math.abs(userDiff - champion.difficulty);
            if (diffDist <= 1) {
                score += 20;
                explanations.push('Perfect difficulty match');
            } else if (diffDist <= 3) {
                score += 10;
            }
        }

        // 3. Playstyle (Tertiary Split)
        if (features.damage && Math.abs(features.damage - champion.damage) <= 2) {
            score += 15;
            explanations.push('Matches damage expectation');
        }

        // 4. Psychological Factors
        if (features.pressure_response === 'Get aggressive and take risks') {
            if (champion.damage >= 8 || champion.mobility >= 7) {
                score += 10;
                explanations.push('Suits aggressive playstyle');
            }
        } else if (features.pressure_response === 'Play cautiously to avoid mistakes') {
            if (champion.toughness >= 7 || champion.utility >= 7) {
                score += 10;
                explanations.push('Good for cautious play');
            }
        }

        return {
            score: this.normalizeScore(score),
            rawScore: score,
            details: {
                algorithm: 'Decision Tree',
                matchedCriteria: explanations,
            },
        };
    }

    private mapDifficulty(difficulty: string): number {
        if (typeof difficulty === 'number') return difficulty;
        return DIFFICULTY_MAP[difficulty] ?? 5;
    }

    private normalizeScore(rawScore: number): number {
        return Math.min(100, (rawScore / 75) * 100);
    }
}
