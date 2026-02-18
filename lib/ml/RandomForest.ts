import type { ChampionData, ChampionDatabase, UserFeatures, ScoreMap, TreeConfig } from './types';

const DIFFICULTY_MAP: Record<string, number> = {
    'Easy (1-3)': 2,
    'Medium (4-6)': 5,
    'Hard (7-8)': 7.5,
    'Very Hard (9-10)': 9.5,
};

export class SimpleRandomForest {
    private allChampions: ChampionDatabase;
    private championEntries: [string, ChampionData][];
    private championCount: number;
    private numTrees: number;
    private trees: TreeConfig[];
    private featureSubsetSize = 5;

    constructor(champions: ChampionDatabase, numTrees = 10) {
        this.allChampions = champions;
        this.championEntries = Object.entries(this.allChampions);
        this.championCount = this.championEntries.length;
        this.numTrees = numTrees;
        this.trees = [];
        this.buildForest();
    }

    private buildForest(): void {
        this.trees = [];
        for (let i = 0; i < this.numTrees; i++) {
            this.trees.push({
                id: i,
                sample: this.bootstrapSample(),
                featureIndices: this.selectRandomFeatures(),
            });
        }
    }

    private bootstrapSample(): [string, ChampionData][] {
        const sample: [string, ChampionData][] = [];
        if (this.championCount === 0) return sample;
        for (let i = 0; i < this.championCount; i++) {
            const idx = Math.floor(Math.random() * this.championCount);
            sample.push(this.championEntries[idx]);
        }
        return sample;
    }

    private selectRandomFeatures(): string[] {
        const all = ['role', 'difficulty', 'damage', 'toughness', 'mobility', 'control', 'utility'];
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, this.featureSubsetSize);
    }

    predictAll(features: UserFeatures): ScoreMap {
        const scores: ScoreMap = {};

        for (const [name, champion] of this.championEntries) {
            const treeScores: number[] = [];
            for (const tree of this.trees) {
                treeScores.push(this.calculateTreeScore(features, champion, tree));
            }

            const meanScore = treeScores.reduce((s, v) => s + v, 0) / treeScores.length;
            const variance = treeScores.reduce((s, v) => s + Math.pow(v - meanScore, 2), 0) / treeScores.length;
            const stdDev = Math.sqrt(variance);

            scores[name] = {
                score: meanScore,
                rawScore: meanScore,
                uncertainty: stdDev,
                details: {
                    contributingFactors: [{ factor: 'Ensemble Average', weight: 100, contribution: meanScore }],
                    matchedCriteria: [`${this.numTrees} trees evaluated`],
                    penalties: [],
                },
            };
        }

        return scores;
    }

    private calculateTreeScore(features: UserFeatures, champion: ChampionData, tree: TreeConfig): number {
        let score = 0;
        let maxPossibleScore = 0;

        if (tree.featureIndices.includes('role')) {
            maxPossibleScore += 40;
            if (features.role === 'No Preference' || features.role === champion.role) score += 40;
        }

        if (tree.featureIndices.includes('difficulty') && features.difficulty) {
            maxPossibleScore += 20;
            const userDiff = this.mapDifficulty(features.difficulty);
            score += Math.max(0, 20 - Math.abs(userDiff - champion.difficulty) * 2);
        }

        if (tree.featureIndices.includes('damage') && features.damage) {
            maxPossibleScore += 15;
            score += Math.max(0, 15 - Math.abs(features.damage - champion.damage) * 1.5);
        }

        if (tree.featureIndices.includes('toughness') && features.toughness) {
            maxPossibleScore += 15;
            score += Math.max(0, 15 - Math.abs(features.toughness - champion.toughness) * 1.5);
        }

        if (tree.featureIndices.includes('mobility')) {
            maxPossibleScore += 10;
            score += champion.mobility;
        }

        if (tree.featureIndices.includes('control')) {
            maxPossibleScore += 10;
            score += champion.control;
        }

        if (tree.featureIndices.includes('utility')) {
            maxPossibleScore += 10;
            score += champion.utility;
        }

        if (maxPossibleScore === 0) return 0;
        return (score / maxPossibleScore) * 100;
    }

    private mapDifficulty(difficulty: string): number {
        if (typeof difficulty === 'number') return difficulty;
        return DIFFICULTY_MAP[difficulty] ?? 5;
    }
}
