export interface Champion {
    id: number;
    key: string;
    name: string;
    title: string;
    tags: string[];
    resourceType: string;
    attackType: string;
    imageUrl: string;
    splashUrl?: string;
    stats?: ChampionStats;
}

export interface ChampionStats {
    winRate: number;
    pickRate: number;
    banRate: number;
    gamesPlayed: number;
    avgKda: number;
}

export interface Item {
    id: number;
    name: string;
    description: string;
    totalCost: number;
    purchasable: boolean;
    mythic: boolean;
    stats: Record<string, number>;
    tags: string[];
    buildsFrom: number[];
    buildsInto: number[];
    imageUrl: string;
    patchVersion: string;
}

export interface ItemStats {
    itemId: number;
    championId: number;
    position: string;
    patchVersion: string;
    rankTier: string;
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    pickRate: number;
    wpa: number;
    wpaAhead: number;
    wpaBehind: number;
    wpaEven: number;
}

export interface TierListEntry {
    item: Item;
    tier: 'S' | 'A' | 'B' | 'C';
    wpa: number;
    winRate: number;
    pickRate: number;
    gamesPlayed: number;
}

export interface Build {
    id: string;
    userId?: string;
    championId: number;
    champion?: Champion;
    name: string;
    description: string;
    position: string;
    coreItems: number[];
    situationalItems: number[];
    startingItems: number[];
    isPublic: boolean;
    upvotes: number;
    views: number;
    createdAt: string;
    author?: string;
}

export interface Match {
    id: string;
    matchId: string;
    gameVersion: string;
    gameDuration: number;
    queueId: number;
    region: string;
    patchVersion: string;
    winningTeam: number;
}

export interface MatchParticipant {
    id: string;
    matchId: string;
    puuid: string;
    championId: number;
    teamId: number;
    position: string;
    kills: number;
    deaths: number;
    assists: number;
    goldEarned: number;
    damageToChampions: number;
    visionScore: number;
    cs: number;
    items: number[];
    win: boolean;
}

export interface TimelinePoint {
    gameTime: number;
    winProbability100: number;
    winProbability200: number;
    goldDiff: number;
    killDiff: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    riotPuuid?: string;
    subscriptionTier: 'free' | 'premium' | 'pro';
    createdAt: string;
}

export interface Matchup {
    opponentId: number;
    opponentName: string;
    opponentImageUrl: string;
    winRate: number;
    gamesPlayed: number;
    goldDiffAt15: number;
}

export type Position = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'SUPPORT';
export type RankTier = 'ALL' | 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'EMERALD' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';
export type Situation = 'all' | 'ahead' | 'behind' | 'even';
