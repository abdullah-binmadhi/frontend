import type { ChampionData, ChampionDatabase, UserFeatures, ScoreMap } from './types';

const DIFFICULTY_MAP: Record<string, number> = {
    'Easy (1-3)': 2,
    'Medium (4-6)': 5,
    'Hard (7-8)': 7.5,
    'Very Hard (9-10)': 9.5,
};

export class SimpleKNN {
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
        const distance = this.calculateDistance(features, champion);
        const similarity = this.normalizeScore(distance);

        return {
            score: similarity,
            rawScore: similarity,
            details: {
                algorithm: 'KNN',
                distance: distance.toFixed(2),
                similarity: similarity.toFixed(1) + '%',
            },
        };
    }

    private calculateDistance(userFeatures: UserFeatures, champion: ChampionData): number {
        let distance = 0;

        if (userFeatures.difficulty) {
            const userDiff = this.mapDifficulty(userFeatures.difficulty);
            distance += Math.pow(userDiff - champion.difficulty, 2);
        }

        if (userFeatures.damage !== undefined) {
            distance += Math.pow((userFeatures.damage || 5) - champion.damage, 2);
        }

        if (userFeatures.toughness !== undefined) {
            distance += Math.pow((userFeatures.toughness || 5) - champion.toughness, 2);
        }

        if (userFeatures.mobility !== undefined) {
            distance += Math.pow(userFeatures.mobility - champion.mobility, 2);
        }

        if (userFeatures.utility !== undefined) {
            distance += Math.pow(userFeatures.utility - champion.utility, 2);
        }

        return Math.sqrt(distance);
    }

    private normalizeScore(distance: number): number {
        const maxDist = 12;
        return Math.max(0, 1 - distance / maxDist) * 100;
    }

    private mapDifficulty(difficulty: string): number {
        if (typeof difficulty === 'number') return difficulty;
        return DIFFICULTY_MAP[difficulty] ?? 5;
    }
}
