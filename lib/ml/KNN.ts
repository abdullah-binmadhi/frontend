import type { ChampionData, ChampionDatabase, UserFeatures, ScoreMap } from './types';

const DIFFICULTY_MAP: Record<string, number> = {
    'Easy (1-3)': 2,
    'Medium (4-6)': 5,
    'Hard (7-8)': 7.5,
    'Very Hard (9-10)': 9.5,
};

/**
 * KNN with categorical distance penalties.
 * Mismatches on role, damage_type, attack_range, and gender
 * add large distance values (equivalent to being 8-10 units apart).
 */
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
        const champ = champion as ChampionData & { damageType?: string; attackRange?: string; gender?: string };

        // ── Categorical dimensions (heavy penalty for mismatch) ──

        // Role mismatch: +10 distance (huge penalty)
        if (userFeatures.role && userFeatures.role !== 'No Preference') {
            if (champion.role !== userFeatures.role) {
                distance += 100; // squared: equivalent to 10 units away
            }
        }

        // Damage type mismatch: +9 distance
        if (userFeatures.damage_type && userFeatures.damage_type !== 'No Preference' && champ.damageType) {
            if (userFeatures.damage_type !== champ.damageType) {
                distance += 81;
            }
        }

        // Attack range mismatch: +9 distance
        if (userFeatures.attack_range && userFeatures.attack_range !== 'No Preference' && champ.attackRange) {
            if (userFeatures.attack_range !== champ.attackRange) {
                distance += 81;
            }
        }

        // Gender mismatch: +7 distance
        if (userFeatures.character_identity && userFeatures.character_identity !== 'No preference' && champ.gender) {
            if (userFeatures.character_identity !== champ.gender) {
                distance += 49;
            }
        }

        // Position mismatch: +5 distance
        if (userFeatures.position && champion.positions && champion.positions.length > 0) {
            if (!champion.positions.includes(userFeatures.position)) {
                distance += 25;
            }
        }

        // ── Continuous dimensions ──

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
        // Max realistic distance with all mismatches: sqrt(100+81+81+49+25+81+25+25+25+25) ≈ 22.8
        const maxDist = 23;
        return Math.max(0, 1 - distance / maxDist) * 100;
    }

    private mapDifficulty(difficulty: string): number {
        if (typeof difficulty === 'number') return difficulty;
        return DIFFICULTY_MAP[difficulty] ?? 5;
    }
}
