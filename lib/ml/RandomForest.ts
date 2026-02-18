import type { ChampionData, ChampionDatabase, UserFeatures, ScoreMap } from './types';

const DIFFICULTY_MAP: Record<string, number> = {
    'Easy (1-3)': 2,
    'Medium (4-6)': 5,
    'Hard (7-8)': 7.5,
    'Very Hard (9-10)': 9.5,
};

/**
 * Random Forest with hard-filter penalties.
 * Critical mismatches (role, damage_type, attack_range, gender) apply
 * severe penalties to the final score.
 */
export class SimpleRandomForest {
    private championEntries: [string, ChampionData][];
    private championCount: number;
    private numTrees: number;
    private trees: { id: number; sample: [string, ChampionData][]; featureIndices: string[] }[];
    private featureSubsetSize = 6;

    constructor(champions: ChampionDatabase, numTrees = 10) {
        this.championEntries = Object.entries(champions);
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
        const all = [
            'role', 'difficulty', 'damage', 'toughness', 'mobility', 'control', 'utility',
            'attack_range', 'damage_type', 'gender', 'position',
        ];
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, this.featureSubsetSize);
    }

    predictAll(features: UserFeatures): ScoreMap {
        const scores: ScoreMap = {};

        for (const [name, champion] of this.championEntries) {
            // Calculate tree ensemble score
            const treeScores: number[] = [];
            for (const tree of this.trees) {
                treeScores.push(this.calculateTreeScore(features, champion, tree));
            }
            let meanScore = treeScores.reduce((s, v) => s + v, 0) / treeScores.length;

            // Apply hard-filter penalties for critical mismatches
            const penalties: string[] = [];
            meanScore = this.applyHardFilters(features, champion, meanScore, penalties);

            const variance = treeScores.reduce((s, v) => s + Math.pow(v - meanScore, 2), 0) / treeScores.length;

            scores[name] = {
                score: Math.max(0, meanScore),
                rawScore: meanScore,
                uncertainty: Math.sqrt(variance),
                details: {
                    contributingFactors: [{ factor: 'Ensemble Average', weight: 100, contribution: meanScore }],
                    matchedCriteria: [`${this.numTrees} trees evaluated`],
                    penalties,
                },
            };
        }

        return scores;
    }

    private applyHardFilters(
        features: UserFeatures,
        champion: ChampionData,
        score: number,
        penalties: string[],
    ): number {
        let penalty = 1.0;
        const champ = champion as ChampionData & { damageType?: string; attackRange?: string; gender?: string };

        // Role mismatch: severe penalty
        if (features.role && features.role !== 'No Preference' && champion.role !== features.role) {
            penalty *= 0.25;
            penalties.push(`Role mismatch: wanted ${features.role}, got ${champion.role}`);
        }

        // Damage type mismatch
        if (features.damage_type && features.damage_type !== 'No Preference' && champ.damageType) {
            if (features.damage_type !== champ.damageType) {
                penalty *= 0.3;
                penalties.push(`Damage type mismatch: wanted ${features.damage_type}, got ${champ.damageType}`);
            }
        }

        // Attack range mismatch
        if (features.attack_range && features.attack_range !== 'No Preference' && champ.attackRange) {
            if (features.attack_range !== champ.attackRange) {
                penalty *= 0.3;
                penalties.push(`Range mismatch: wanted ${features.attack_range}, got ${champ.attackRange}`);
            }
        }

        // Gender mismatch
        if (features.character_identity && features.character_identity !== 'No preference' && champ.gender) {
            if (features.character_identity === 'Male' && champ.gender !== 'Male') {
                penalty *= 0.35;
                penalties.push(`Gender mismatch: wanted Male, got ${champ.gender}`);
            } else if (features.character_identity === 'Female' && champ.gender !== 'Female') {
                penalty *= 0.35;
                penalties.push(`Gender mismatch: wanted Female, got ${champ.gender}`);
            } else if (features.character_identity === 'Non-human' && champ.gender !== 'Non-human') {
                penalty *= 0.35;
                penalties.push(`Gender mismatch: wanted Non-human, got ${champ.gender}`);
            }
        }

        // Position mismatch (softer penalty)
        if (features.position && champion.positions && champion.positions.length > 0) {
            if (!champion.positions.includes(features.position)) {
                penalty *= 0.6;
                penalties.push(`Position mismatch: wanted ${features.position}, not in [${champion.positions.join(', ')}]`);
            }
        }

        return score * penalty;
    }

    private calculateTreeScore(
        features: UserFeatures,
        champion: ChampionData,
        tree: { featureIndices: string[] },
    ): number {
        let score = 0;
        let maxPossibleScore = 0;
        const champ = champion as ChampionData & { damageType?: string; attackRange?: string; gender?: string };

        if (tree.featureIndices.includes('role')) {
            maxPossibleScore += 25;
            if (features.role === 'No Preference' || features.role === champion.role) score += 25;
        }

        if (tree.featureIndices.includes('damage_type')) {
            maxPossibleScore += 20;
            if (!features.damage_type || features.damage_type === 'No Preference') score += 20;
            else if (champ.damageType && features.damage_type === champ.damageType) score += 20;
        }

        if (tree.featureIndices.includes('attack_range')) {
            maxPossibleScore += 15;
            if (!features.attack_range || features.attack_range === 'No Preference') score += 15;
            else if (champ.attackRange && features.attack_range === champ.attackRange) score += 15;
        }

        if (tree.featureIndices.includes('gender')) {
            maxPossibleScore += 10;
            if (!features.character_identity || features.character_identity === 'No preference') score += 10;
            else if (champ.gender && features.character_identity === champ.gender) score += 10;
        }

        if (tree.featureIndices.includes('position')) {
            maxPossibleScore += 10;
            if (!features.position || !champion.positions) score += 10;
            else if (champion.positions.includes(features.position)) score += 10;
        }

        if (tree.featureIndices.includes('difficulty') && features.difficulty) {
            maxPossibleScore += 15;
            const userDiff = this.mapDifficulty(features.difficulty);
            score += Math.max(0, 15 - Math.abs(userDiff - champion.difficulty) * 2);
        }

        if (tree.featureIndices.includes('damage') && features.damage) {
            maxPossibleScore += 10;
            score += Math.max(0, 10 - Math.abs(features.damage - champion.damage) * 1.5);
        }

        if (tree.featureIndices.includes('toughness') && features.toughness) {
            maxPossibleScore += 10;
            score += Math.max(0, 10 - Math.abs(features.toughness - champion.toughness) * 1.5);
        }

        if (tree.featureIndices.includes('mobility')) {
            maxPossibleScore += 8;
            score += (champion.mobility / 10) * 8;
        }

        if (tree.featureIndices.includes('control')) {
            maxPossibleScore += 8;
            score += (champion.control / 10) * 8;
        }

        if (tree.featureIndices.includes('utility')) {
            maxPossibleScore += 8;
            score += (champion.utility / 10) * 8;
        }

        if (maxPossibleScore === 0) return 0;
        return (score / maxPossibleScore) * 100;
    }

    private mapDifficulty(difficulty: string): number {
        if (typeof difficulty === 'number') return difficulty;
        return DIFFICULTY_MAP[difficulty] ?? 5;
    }
}
