// Shared type definitions for ML algorithms

export interface ChampionData {
    role: string;
    positions: string[];
    difficulty: number;
    damage: number;
    toughness: number;
    control: number;
    mobility: number;
    utility: number;
    image?: string;
    stats?: {
        winRate: number;
        pickRate: number;
        banRate: number;
        tier: string;
        trend: string;
    };
}

export type ChampionDatabase = Record<string, ChampionData>;

export interface UserFeatures {
    role: string;
    difficulty: string;
    damage: number;
    toughness: number;
    mobility: number;
    control: number;
    utility: number;
    position: string;
    playstyle: string;
    attack_range?: string;
    resource_type?: string;
    damage_type?: string;
    pressure_response: string;
    aesthetic_preference?: string;
    team_contribution: string;
    character_identity?: string;
    problem_solving: string;
}

export interface ScoreDetails {
    contributingFactors?: Array<{ factor: string; weight: number; contribution: number }>;
    matchedCriteria?: string[];
    penalties?: string[];
    algorithm?: string;
    distance?: string;
    similarity?: string;
}

export interface AlgorithmScore {
    score: number;
    rawScore: number;
    uncertainty?: number;
    details: ScoreDetails;
}

export type ScoreMap = Record<string, AlgorithmScore>;

export interface AggregatedScore {
    championName: string;
    randomForest: number;
    decisionTree: number;
    knn: number;
    average: number;
    weighted: number;
    details: {
        randomForest: ScoreDetails | null;
        decisionTree: ScoreDetails | null;
        knn: ScoreDetails | null;
    };
}

export interface QuizQuestion {
    id: number;
    text: string;
    type: string;
    options: string[];
    weight: number;
    feature_mapping: string;
    dimension?: string;
}

export interface QuizData {
    questions: QuizQuestion[];
}

export interface RecommendationResult {
    top10: AggregatedScore[];
    metrics: QualityMetrics;
    allScores: Record<string, AggregatedScore>;
}

export interface QualityMetrics {
    precisionAt1: number;
    precisionAt3: number;
    precisionAt5: number;
    precisionAt10: number;
    recallAt1: number;
    recallAt3: number;
    recallAt5: number;
    recallAt10: number;
    f1At1: number;
    f1At3: number;
    f1At5: number;
    f1At10: number;
    mrr: number;
    relevantCount: number;
}

export interface TreeConfig {
    id: number;
    sample: [string, ChampionData][];
    featureIndices: string[];
}

// --- Riot API / Data Dragon types ---

export interface DDragonChampionInfo {
    ddragonId: string;
    key: number;
    name: string;
    title: string;
    tags: string[];
    image: string;
    info: { attack: number; defense: number; magic: number; difficulty: number };
    stats: {
        hp: number;
        armor: number;
        attackDamage: number;
        moveSpeed: number;
        attackRange: number;
    };
}

export interface EnrichedChampionData extends ChampionData {
    ddragonId?: string;
    tags?: string[];
    title?: string;
    gender?: string;
    damageType?: string;
    attackRange?: string;
    riotInfo?: { attack: number; defense: number; magic: number; difficulty: number };
    realStats?: {
        hp: number;
        armor: number;
        attackDamage: number;
        moveSpeed: number;
        attackRange: number;
    };
    isFreeRotation?: boolean;
}

export type EnrichedChampionDatabase = Record<string, EnrichedChampionData>;

export interface EnrichmentStatus {
    isLive: boolean;
    patchVersion: string | null;
    championCount: number;
    freeRotationCount: number;
    timestamp: string | null;
    error: string | null;
}
