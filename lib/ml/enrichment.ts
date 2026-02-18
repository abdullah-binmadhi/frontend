import type {
    ChampionDatabase,
    EnrichedChampionDatabase,
    DDragonChampionInfo,
    EnrichmentStatus,
} from './types';

// Champion name mapping: DDragon name → our champion name
const NAME_OVERRIDES: Record<string, string> = {
    'Nunu & Willump': 'Nunu',
    'Renata Glasc': 'Renata',
    'Wukong': 'Wukong',
};

/**
 * Normalize real champion stats into 1-10 scale for ML features.
 */
function normalizeStatToScale(value: number, min: number, max: number): number {
    const clamped = Math.max(min, Math.min(max, value));
    return Math.round(((clamped - min) / (max - min)) * 9 + 1);
}

function normalizeDamage(attackDamage: number, infoAttack: number): number {
    const adNorm = normalizeStatToScale(attackDamage, 48, 72);
    return Math.round((adNorm + infoAttack) / 2);
}

function normalizeToughness(armor: number, hp: number, infoDefense: number): number {
    const armorNorm = normalizeStatToScale(armor, 20, 50);
    const hpNorm = normalizeStatToScale(hp, 480, 700);
    return Math.round((armorNorm + hpNorm + infoDefense) / 3);
}

function normalizeMobility(moveSpeed: number): number {
    return normalizeStatToScale(moveSpeed, 325, 355);
}

/**
 * Fetch enriched champion data from our API routes.
 * Blends live DDragon stats (40%) with existing hand-tuned values (60%).
 */
export async function enrichChampionsWithRiotData(
    staticChampions: ChampionDatabase,
): Promise<{ champions: EnrichedChampionDatabase; status: EnrichmentStatus }> {
    const defaultStatus: EnrichmentStatus = {
        isLive: false,
        patchVersion: null,
        championCount: Object.keys(staticChampions).length,
        freeRotationCount: 0,
        timestamp: null,
        error: null,
    };

    // Start with a copy of static data
    const enriched: EnrichedChampionDatabase = {};
    for (const [name, data] of Object.entries(staticChampions)) {
        enriched[name] = { ...data };
    }

    try {
        // 1. Fetch DDragon and rotation data in parallel
        const [championsRes, rotationRes] = await Promise.allSettled([
            fetch('/api/riot/champions'),
            fetch('/api/riot/rotation'),
        ]);

        // 2. Process DDragon data
        let patchVersion: string | null = null;
        const keyToName: Map<number, string> = new Map();

        if (championsRes.status === 'fulfilled' && championsRes.value.ok) {
            const champData = await championsRes.value.json();
            patchVersion = champData.version;
            const ddragonChampions: Record<string, DDragonChampionInfo & { key: number }> = champData.champions || {};

            for (const [ddragonName, ddragonInfo] of Object.entries(ddragonChampions)) {
                const resolvedName = NAME_OVERRIDES[ddragonName] || ddragonName;

                // Build numeric key → name map for rotation matching
                keyToName.set(ddragonInfo.key, resolvedName);

                if (enriched[resolvedName]) {
                    const champ = enriched[resolvedName];

                    // Enrich with DDragon metadata
                    champ.ddragonId = ddragonInfo.ddragonId;
                    champ.tags = ddragonInfo.tags;
                    champ.title = ddragonInfo.title;
                    champ.riotInfo = ddragonInfo.info;
                    champ.realStats = ddragonInfo.stats;
                    champ.image = ddragonInfo.image;
                    champ.isFreeRotation = false;

                    // Enhance ML features: 60% hand-tuned + 40% real DDragon stats
                    if (ddragonInfo.stats && ddragonInfo.info) {
                        const realDamage = normalizeDamage(ddragonInfo.stats.attackDamage, ddragonInfo.info.attack);
                        const realToughness = normalizeToughness(
                            ddragonInfo.stats.armor,
                            ddragonInfo.stats.hp,
                            ddragonInfo.info.defense,
                        );
                        const realMobility = normalizeMobility(ddragonInfo.stats.moveSpeed);

                        champ.damage = Math.round(champ.damage * 0.6 + realDamage * 0.4);
                        champ.toughness = Math.round(champ.toughness * 0.6 + realToughness * 0.4);
                        champ.mobility = Math.round(champ.mobility * 0.6 + realMobility * 0.4);
                        champ.difficulty = Math.round(champ.difficulty * 0.6 + ddragonInfo.info.difficulty * 0.4);
                    }
                }
            }
        }

        // 3. Process free rotation data
        let freeRotationCount = 0;
        if (rotationRes.status === 'fulfilled' && rotationRes.value.ok) {
            const rotationData = await rotationRes.value.json();
            const freeIds = new Set<number>([
                ...(rotationData.freeChampionIds || []),
                ...(rotationData.freeChampionIdsForNewPlayers || []),
            ]);
            freeRotationCount = freeIds.size;

            // Mark free rotation champions using numeric key mapping
            for (const freeId of freeIds) {
                const champName = keyToName.get(freeId);
                if (champName && enriched[champName]) {
                    enriched[champName].isFreeRotation = true;
                }
            }
        }

        return {
            champions: enriched,
            status: {
                isLive: patchVersion !== null,
                patchVersion,
                championCount: Object.keys(enriched).length,
                freeRotationCount,
                timestamp: new Date().toISOString(),
                error: null,
            },
        };
    } catch (error) {
        console.error('[Enrichment] Failed to enrich champion data:', error);
        return {
            champions: enriched,
            status: {
                ...defaultStatus,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        };
    }
}
