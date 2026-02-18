import type { ChampionData, ChampionDatabase, UserFeatures, ScoreMap } from './types';

const DIFFICULTY_MAP: Record<string, number> = {
    'Easy (1-3)': 2,
    'Medium (4-6)': 5,
    'Hard (7-8)': 7.5,
    'Very Hard (9-10)': 9.5,
};

/**
 * Decision Tree with proper hierarchy:
 * Role → Damage Type → Attack Range → Gender → Position → Difficulty → Playstyle → Psychological
 * Each critical mismatch compounds a score reduction.
 */
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
        let penalty = 1.0;
        const explanations: string[] = [];
        const champ = champion as ChampionData & { damageType?: string; attackRange?: string; gender?: string };

        // ── Split 1: Role (30 pts) ──
        if (features.role === 'No Preference' || features.role === champion.role) {
            score += 30;
            explanations.push(`Role match: ${champion.role}`);
        } else {
            penalty *= 0.3;
            explanations.push(`Role MISMATCH: wanted ${features.role}, got ${champion.role}`);
        }

        // ── Split 2: Damage Type (25 pts) ──
        if (!features.damage_type || features.damage_type === 'No Preference') {
            score += 25;
        } else if (champ.damageType && features.damage_type === champ.damageType) {
            score += 25;
            explanations.push(`Damage type match: ${champ.damageType}`);
        } else {
            penalty *= 0.35;
            explanations.push(`Damage type MISMATCH: wanted ${features.damage_type}, got ${champ.damageType || 'unknown'}`);
        }

        // ── Split 3: Attack Range (20 pts) ──
        if (!features.attack_range || features.attack_range === 'No Preference') {
            score += 20;
        } else if (champ.attackRange && features.attack_range === champ.attackRange) {
            score += 20;
            explanations.push(`Range match: ${champ.attackRange}`);
        } else {
            penalty *= 0.35;
            explanations.push(`Range MISMATCH: wanted ${features.attack_range}, got ${champ.attackRange || 'unknown'}`);
        }

        // ── Split 4: Gender/Identity (15 pts) ──
        if (!features.character_identity || features.character_identity === 'No preference') {
            score += 15;
        } else if (champ.gender) {
            if (features.character_identity === champ.gender) {
                score += 15;
                explanations.push(`Gender match: ${champ.gender}`);
            } else if (features.character_identity === 'Non-human' && champ.gender === 'Non-human') {
                score += 15;
            } else {
                penalty *= 0.4;
                explanations.push(`Gender MISMATCH: wanted ${features.character_identity}, got ${champ.gender}`);
            }
        }

        // ── Split 5: Position (10 pts) ──
        if (!features.position || !champion.positions || champion.positions.length === 0) {
            score += 10;
        } else if (champion.positions.includes(features.position)) {
            score += 10;
            explanations.push(`Position match: ${features.position}`);
        } else {
            penalty *= 0.6;
        }

        // ── Split 6: Difficulty (15 pts) ──
        if (features.difficulty) {
            const userDiff = this.mapDifficulty(features.difficulty);
            const diffDist = Math.abs(userDiff - champion.difficulty);
            if (diffDist <= 1) {
                score += 15;
                explanations.push('Perfect difficulty match');
            } else if (diffDist <= 3) {
                score += 8;
            } else {
                score += 3;
            }
        }

        // ── Split 7: Playstyle / Damage-Toughness (10 pts) ──
        if (features.damage && Math.abs(features.damage - champion.damage) <= 2) {
            score += 5;
            explanations.push('Matches damage expectation');
        }
        if (features.toughness && Math.abs(features.toughness - champion.toughness) <= 2) {
            score += 5;
        }

        // ── Split 8: Psychological Factors (10 pts) ──
        if (features.pressure_response === 'Get aggressive and take risks') {
            if (champion.damage >= 8 || champion.mobility >= 7) score += 5;
        } else if (features.pressure_response === 'Stay calm and strategic') {
            if (champion.control >= 6 || champion.utility >= 6) score += 5;
        } else if (features.pressure_response === 'Play cautiously to avoid mistakes') {
            if (champion.toughness >= 7 || champion.utility >= 7) score += 5;
        } else if (features.pressure_response === 'Take charge and lead') {
            if (champion.damage >= 7 || champion.control >= 7) score += 5;
        }

        if (features.team_contribution === 'Lead and make decisions' && champion.control >= 7) score += 5;
        else if (features.team_contribution === 'Support and enable others' && champion.utility >= 7) score += 5;
        else if (features.team_contribution === 'Balance between both') score += 3;
        else if (features.team_contribution === 'Stay independent and focus on my role' && champion.damage >= 7) score += 5;

        // Apply compounding penalty from critical mismatches
        const finalScore = score * penalty;

        return {
            score: this.normalizeScore(finalScore),
            rawScore: finalScore,
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
        // Max possible raw score = 30 + 25 + 20 + 15 + 10 + 15 + 10 + 10 = 135
        return Math.min(100, (rawScore / 135) * 100);
    }
}
