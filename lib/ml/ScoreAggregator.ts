import type {
    ChampionData,
    ChampionDatabase,
    UserFeatures,
    ScoreMap,
    AggregatedScore,
    QualityMetrics,
} from './types';

const DIFFICULTY_MAP: Record<string, number> = {
    'Easy (1-3)': 2,
    'Medium (4-6)': 5,
    'Hard (7-8)': 7.5,
    'Very Hard (9-10)': 9.5,
};

const PLAYSTYLE_MAP: Record<string, { damage: number; toughness: number }> = {
    'High Damage Output': { damage: 8, toughness: 3 },
    'Tanky and Durable': { damage: 4, toughness: 8 },
    'Support Team': { damage: 3, toughness: 5 },
    'Balanced/Hybrid': { damage: 5, toughness: 5 },
};

export class ScoreAggregator {
    static aggregateScores(
        rfScores: ScoreMap,
        dtScores: ScoreMap,
        knnScores: ScoreMap,
        allChampions: ChampionDatabase,
        userFeatures?: UserFeatures,
    ): Record<string, AggregatedScore> {
        const aggregated: Record<string, AggregatedScore> = {};

        for (const championName of Object.keys(allChampions)) {
            const rf = rfScores[championName]?.score || 0;
            const dt = dtScores[championName]?.score || 0;
            const knn = knnScores[championName]?.score || 0;

            let average = rf * 0.4 + dt * 0.3 + knn * 0.3;

            // Post-aggregation hard filter: cap score if critical mismatches exist
            if (userFeatures) {
                const champ = allChampions[championName] as ChampionData & {
                    damageType?: string; attackRange?: string; gender?: string; tags?: string[];
                };
                
                // --- STRICT HARD FILTER: ROLE/CLASS ---
                // If the user requested a specific class, the champion MUST have it (either as primary role or in tags)
                if (userFeatures.role && userFeatures.role !== 'No Preference') {
                    const primaryRoleMatches = champ.role === userFeatures.role;
                    const tagMatches = champ.tags?.includes(userFeatures.role) || false;
                    
                    if (!primaryRoleMatches && !tagMatches) {
                        continue; // Completely exclude this champion from recommendations
                    }
                }

                let criticalMismatches = 0;

                if (userFeatures.damage_type && userFeatures.damage_type !== 'No Preference' &&
                    champ.damageType && userFeatures.damage_type !== champ.damageType) {
                    criticalMismatches++;
                }
                if (userFeatures.attack_range && userFeatures.attack_range !== 'No Preference' &&
                    champ.attackRange && userFeatures.attack_range !== champ.attackRange) {
                    criticalMismatches++;
                }
                if (userFeatures.character_identity && userFeatures.character_identity !== 'No preference' &&
                    champ.gender && userFeatures.character_identity !== champ.gender) {
                    criticalMismatches++;
                }

                // Cap score based on mismatch count
                if (criticalMismatches >= 3) average = Math.min(average, 5);
                else if (criticalMismatches >= 2) average = Math.min(average, 15);
                else if (criticalMismatches >= 1) average = Math.min(average, 40);
            }

            const weighted = Math.max(0, Math.min(100, average));

            aggregated[championName] = {
                championName,
                randomForest: rf,
                decisionTree: dt,
                knn,
                average,
                weighted,
                details: {
                    randomForest: rfScores[championName]?.details || null,
                    decisionTree: dtScores[championName]?.details || null,
                    knn: knnScores[championName]?.details || null,
                },
            };
        }

        return aggregated;
    }

    static selectTop10(
        aggregatedScores: Record<string, AggregatedScore>,
        allChampions: ChampionDatabase,
        userFeatures?: UserFeatures,
        diversityFilter = true,
    ): AggregatedScore[] {
        let champions = Object.values(aggregatedScores);
        champions.sort((a, b) => b.average - a.average);

        // If the user actively picked a specific role, we DO NOT want diversity (which forces 
        // a maximum of 3 champions per role). We explicitly want ALL top champions to be that role.
        const shouldApplyDiversity = diversityFilter && (!userFeatures?.role || userFeatures.role === 'No Preference');
        
        if (shouldApplyDiversity) {
            champions = this.applyDiversityFilter(champions, allChampions);
        }

        const top10 = champions.slice(0, 10);
        const uniqueChampions: AggregatedScore[] = [];
        const seenNames = new Set<string>();

        for (const champion of top10) {
            if (!seenNames.has(champion.championName)) {
                uniqueChampions.push(champion);
                seenNames.add(champion.championName);
            }
        }

        if (uniqueChampions.length < 10) {
            for (const champion of champions) {
                if (!seenNames.has(champion.championName)) {
                    uniqueChampions.push(champion);
                    seenNames.add(champion.championName);
                    if (uniqueChampions.length >= 10) break;
                }
            }
        }

        return uniqueChampions;
    }

    private static applyDiversityFilter(
        champions: AggregatedScore[],
        allChampions: ChampionDatabase,
    ): AggregatedScore[] {
        const selected: AggregatedScore[] = [];
        const roleCount: Record<string, number> = {};

        for (const champion of champions) {
            const championData = allChampions[champion.championName];
            const role = championData?.role || 'Unknown';

            if ((roleCount[role] || 0) < 3) {
                selected.push(champion);
                roleCount[role] = (roleCount[role] || 0) + 1;
            }

            if (selected.length >= 10) break;
        }

        if (selected.length < 10) {
            for (const champion of champions) {
                if (!selected.find((c) => c.championName === champion.championName)) {
                    selected.push(champion);
                    if (selected.length >= 10) break;
                }
            }
        }

        return selected;
    }
}

export class EvaluationMetrics {
    static precisionAtK(recommended: string[], relevant: Set<string>, k: number): number {
        if (!recommended || recommended.length === 0 || k === 0) return 0;
        const topK = recommended.slice(0, k);
        let count = 0;
        for (const c of topK) {
            if (relevant.has(c)) count++;
        }
        return count / topK.length;
    }

    static recallAtK(recommended: string[], relevant: Set<string>, k: number): number {
        if (!recommended || recommended.length === 0 || k === 0 || relevant.size === 0) return 0;
        const topK = recommended.slice(0, k);
        let count = 0;
        for (const c of topK) {
            if (relevant.has(c)) count++;
        }
        return count / relevant.size;
    }

    static f1ScoreAtK(recommended: string[], relevant: Set<string>, k: number): number {
        const precision = this.precisionAtK(recommended, relevant, k);
        const recall = this.recallAtK(recommended, relevant, k);
        if (precision === 0 && recall === 0) return 0;
        return (2 * precision * recall) / (precision + recall);
    }

    static meanReciprocalRank(recommended: string[], relevant: Set<string>): number {
        if (!recommended || recommended.length === 0) return 0;
        for (let i = 0; i < recommended.length; i++) {
            if (relevant.has(recommended[i])) return 1.0 / (i + 1);
        }
        return 0;
    }

    static calculateUserRelevance(
        userAnswers: UserFeatures,
        allChampions: ChampionDatabase,
        mlScores: { top10: AggregatedScore[] } | null = null,
    ): Set<string> {
        const championScores: Array<{ name: string; score: number; mlScored: boolean }> = [];

        const userRole = userAnswers.role || 'No Preference';
        const userPosition = userAnswers.position || 'No Preference';
        const difficultyAnswer = userAnswers.difficulty;
        const playstyleAnswer = userAnswers.playstyle;

        const userDifficulty = typeof difficultyAnswer === 'number'
            ? difficultyAnswer
            : DIFFICULTY_MAP[difficultyAnswer] ?? null;

        const mapped = PLAYSTYLE_MAP[playstyleAnswer] || { damage: null, toughness: null };
        const userDamage = mapped.damage;
        const userToughness = mapped.toughness;

        const pressureResponse = userAnswers.pressure_response || 'Stay calm and strategic';
        const teamContribution = userAnswers.team_contribution || 'Balance between both';
        const problemSolving = userAnswers.problem_solving || 'Analyze carefully before acting';

        const mlScoredChampions = new Set<string>();
        if (mlScores?.top10) {
            for (const champion of mlScores.top10) {
                if (champion.average >= 80) mlScoredChampions.add(champion.championName);
            }
        }

        for (const [championName, champion] of Object.entries(allChampions)) {
            let compatibilityScore = 0;
            let maxPossibleScore = 0;

            // Role/Position match (40 pts)
            maxPossibleScore += 40;
            if (userRole === 'No Preference' || champion.role === userRole) {
                compatibilityScore += 40;
            } else if (userPosition !== 'No Preference' && champion.positions?.includes(userPosition)) {
                compatibilityScore += 30;
            }

            // Difficulty match (15 pts)
            if (userDifficulty !== null) {
                maxPossibleScore += 15;
                const diff = Math.abs(userDifficulty - champion.difficulty);
                if (diff === 0) compatibilityScore += 15;
                else if (diff <= 1) compatibilityScore += 12;
                else if (diff <= 2) compatibilityScore += 8;
            }

            // Damage match (12 pts)
            if (userDamage !== null) {
                maxPossibleScore += 12;
                const diff = Math.abs(userDamage - champion.damage);
                if (diff === 0) compatibilityScore += 12;
                else if (diff <= 1) compatibilityScore += 10;
                else if (diff <= 2) compatibilityScore += 6;
            }

            // Toughness match (12 pts)
            if (userToughness !== null) {
                maxPossibleScore += 12;
                const diff = Math.abs(userToughness - champion.toughness);
                if (diff === 0) compatibilityScore += 12;
                else if (diff <= 1) compatibilityScore += 10;
                else if (diff <= 2) compatibilityScore += 6;
            }

            // Psychological preferences (21 pts)
            maxPossibleScore += 21;

            // Pressure response
            if (pressureResponse === 'Stay calm and strategic' && champion.toughness >= 6) compatibilityScore += 7;
            else if (pressureResponse === 'Take charge and lead' && (champion.damage >= 7 || champion.control >= 7)) compatibilityScore += 7;
            else if (pressureResponse === 'Get aggressive and take risks' && champion.damage >= 8) compatibilityScore += 7;
            else if (pressureResponse === 'Play cautiously to avoid mistakes' && champion.toughness >= 7) compatibilityScore += 7;
            else compatibilityScore += 3;

            // Team contribution
            if (teamContribution === 'Lead and make decisions' && champion.control >= 7) compatibilityScore += 7;
            else if (teamContribution === 'Support and enable others' && champion.utility >= 7) compatibilityScore += 7;
            else if (teamContribution === 'Balance between both' && champion.utility >= 5 && champion.control >= 5) compatibilityScore += 7;
            else if (teamContribution === 'Stay independent and focus on my role' && champion.damage >= 7) compatibilityScore += 7;
            else compatibilityScore += 3;

            // Problem solving
            if (problemSolving === 'Analyze carefully before acting' && champion.control >= 7) compatibilityScore += 7;
            else if (problemSolving === 'Jump in and adapt on the fly' && champion.mobility >= 7) compatibilityScore += 7;
            else if (problemSolving === "Follow the team's lead" && champion.utility >= 6) compatibilityScore += 7;
            else if (problemSolving === 'Focus on long-term improvement' && champion.difficulty >= 7) compatibilityScore += 7;
            else compatibilityScore += 3;

            const pct = maxPossibleScore > 0 ? (compatibilityScore / maxPossibleScore) * 100 : 0;
            championScores.push({ name: championName, score: pct, mlScored: mlScoredChampions.has(championName) });
        }

        championScores.sort((a, b) => b.score - a.score);

        const relevantChampions = new Set<string>();
        mlScoredChampions.forEach((c) => relevantChampions.add(c));

        const topScore = championScores[0]?.score ?? 0;
        const threshold = Math.max(topScore * 0.75, 60);
        for (const champ of championScores) {
            if (champ.score >= threshold) relevantChampions.add(champ.name);
        }

        if (relevantChampions.size < 10) {
            for (let i = 0; i < championScores.length && relevantChampions.size < 10; i++) {
                relevantChampions.add(championScores[i].name);
            }
        }

        if (relevantChampions.size > 25) {
            const capped = new Set<string>();
            let count = 0;
            for (const champ of championScores) {
                if (mlScoredChampions.has(champ.name)) { capped.add(champ.name); count++; }
            }
            for (const champ of championScores) {
                if (count >= 25) break;
                if (!mlScoredChampions.has(champ.name) && relevantChampions.has(champ.name)) {
                    capped.add(champ.name); count++;
                }
            }
            return capped;
        }

        return relevantChampions;
    }

    static computeAllMetrics(recommendedNames: string[], relevant: Set<string>): QualityMetrics {
        return {
            precisionAt1: this.precisionAtK(recommendedNames, relevant, 1),
            precisionAt3: this.precisionAtK(recommendedNames, relevant, 3),
            precisionAt5: this.precisionAtK(recommendedNames, relevant, 5),
            precisionAt10: this.precisionAtK(recommendedNames, relevant, 10),
            recallAt1: this.recallAtK(recommendedNames, relevant, 1),
            recallAt3: this.recallAtK(recommendedNames, relevant, 3),
            recallAt5: this.recallAtK(recommendedNames, relevant, 5),
            recallAt10: this.recallAtK(recommendedNames, relevant, 10),
            f1At1: this.f1ScoreAtK(recommendedNames, relevant, 1),
            f1At3: this.f1ScoreAtK(recommendedNames, relevant, 3),
            f1At5: this.f1ScoreAtK(recommendedNames, relevant, 5),
            f1At10: this.f1ScoreAtK(recommendedNames, relevant, 10),
            mrr: this.meanReciprocalRank(recommendedNames, relevant),
            relevantCount: relevant.size,
        };
    }
}
