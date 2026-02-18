import type {
    ChampionDatabase,
    EnrichedChampionDatabase,
    DDragonChampionInfo,
    EnrichmentStatus,
} from './types';

// ── Gender map for all LoL champions ──
// DDragon does not provide gender, so this is a curated static map.
const GENDER_MAP: Record<string, string> = {
    Aatrox: 'Male', Ahri: 'Female', Akali: 'Female', Akshan: 'Male', Alistar: 'Male',
    Ammu: 'Male', Anivia: 'Female', Annie: 'Female', Aphelios: 'Male', Ashe: 'Female',
    'Aurelion Sol': 'Non-human', Azir: 'Male',
    Bard: 'Non-human', "Bel'Veth": 'Female', Blitzcrank: 'Non-human', Brand: 'Male',
    Braum: 'Male', Briar: 'Female',
    Caitlyn: 'Female', Camille: 'Female', Cassiopeia: 'Female', "Cho'Gath": 'Non-human',
    Corki: 'Male',
    Darius: 'Male', Diana: 'Female', 'Dr. Mundo': 'Male', Draven: 'Male',
    Ekko: 'Male', Elise: 'Female', Evelynn: 'Female', Ezreal: 'Male',
    Fiddlesticks: 'Non-human', Fiora: 'Female', Fizz: 'Male',
    Galio: 'Non-human', Gangplank: 'Male', Garen: 'Male', Gnar: 'Non-human',
    Gragas: 'Male', Graves: 'Male', Gwen: 'Female',
    Hecarim: 'Non-human', Heimerdinger: 'Male', Hwei: 'Male',
    Illaoi: 'Female', Irelia: 'Female', Ivern: 'Male',
    Janna: 'Female', 'Jarvan IV': 'Male', Jax: 'Male', Jayce: 'Male',
    Jhin: 'Male', Jinx: 'Female',
    "Kai'Sa": 'Female', Kalista: 'Female', Karma: 'Female', Karthus: 'Male',
    Kassadin: 'Male', Katarina: 'Female', Kayle: 'Female', Kayn: 'Male',
    Kennen: 'Male', "Kha'Zix": 'Non-human', Kindred: 'Female', Kled: 'Male',
    "Kog'Maw": 'Non-human',
    LeBlanc: 'Female', 'Lee Sin': 'Male', Leona: 'Female', Lillia: 'Female',
    Lissandra: 'Female', Lucian: 'Male', Lulu: 'Female', Lux: 'Female',
    Malphite: 'Non-human', Malzahar: 'Male', Maokai: 'Non-human', 'Master Yi': 'Male',
    'Miss Fortune': 'Female', Mordekaiser: 'Male', Morgana: 'Female',
    Nami: 'Female', Nasus: 'Male', Nautilus: 'Male', Neeko: 'Female',
    Nidalee: 'Female', Nilah: 'Female', Nocturne: 'Non-human', 'Nunu & Willump': 'Male',
    Olaf: 'Male', Orianna: 'Female', Ornn: 'Male',
    Pantheon: 'Male', Poppy: 'Female', Pyke: 'Male',
    Qiyana: 'Female', Quinn: 'Female',
    Rakan: 'Male', Rammus: 'Non-human', "Rek'Sai": 'Female', Rell: 'Female',
    Renata: 'Female', Renekton: 'Non-human', Rengar: 'Non-human', Riven: 'Female',
    Rumble: 'Male', Ryze: 'Male',
    Samira: 'Female', Sejuani: 'Female', Senna: 'Female', Seraphine: 'Female',
    Sett: 'Male', Shaco: 'Male', Shen: 'Male', Shyvana: 'Female', Singed: 'Male',
    Sion: 'Male', Sivir: 'Female', Skarner: 'Non-human', Smolder: 'Non-human',
    Sona: 'Female', Soraka: 'Female', Swain: 'Male', Sylas: 'Male', Syndra: 'Female',
    'Tahm Kench': 'Non-human', Taliyah: 'Female', Talon: 'Male', Taric: 'Male',
    Teemo: 'Male', Thresh: 'Male', Tristana: 'Female', Trundle: 'Male',
    Tryndamere: 'Male', 'Twisted Fate': 'Male', Twitch: 'Non-human',
    Udyr: 'Male', Urgot: 'Male',
    Varus: 'Male', Vayne: 'Female', Veigar: 'Male', "Vel'Koz": 'Non-human',
    Vex: 'Female', Vi: 'Female', Viego: 'Male', Viktor: 'Male', Vladimir: 'Male',
    Volibear: 'Non-human',
    Warwick: 'Non-human', Wukong: 'Male',
    Xayah: 'Female', Xerath: 'Non-human', 'Xin Zhao': 'Male',
    Yasuo: 'Male', Yone: 'Male', Yorick: 'Male', Yuumi: 'Non-human',
    Zac: 'Non-human', Zed: 'Male', Zeri: 'Female', Ziggs: 'Male',
    Zilean: 'Male', Zoe: 'Female', Zyra: 'Female',
};

// DDragon name overrides
const NAME_OVERRIDES: Record<string, string> = {
    'Nunu & Willump': 'Nunu',
    'Renata Glasc': 'Renata',
};

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
 * Derive damage type from DDragon info ratings.
 * If magic > attack → "Magic", else → "Physical"
 */
function deriveDamageType(info: { attack: number; magic: number }): string {
    return info.magic > info.attack ? 'Magic' : 'Physical';
}

/**
 * Derive attack range category from DDragon stats.
 * Standard LoL: melee < 300, ranged >= 300
 */
function deriveAttackRange(attackRange: number): string {
    return attackRange >= 300 ? 'Ranged' : 'Melee';
}

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

    const enriched: EnrichedChampionDatabase = {};
    for (const [name, data] of Object.entries(staticChampions)) {
        enriched[name] = {
            ...data,
            gender: GENDER_MAP[name] || 'Other',
        };
    }

    try {
        const [championsRes, rotationRes] = await Promise.allSettled([
            fetch('/api/riot/champions'),
            fetch('/api/riot/rotation'),
        ]);

        let patchVersion: string | null = null;
        const keyToName: Map<number, string> = new Map();

        if (championsRes.status === 'fulfilled' && championsRes.value.ok) {
            const champData = await championsRes.value.json();
            patchVersion = champData.version;
            const ddragonChampions: Record<string, DDragonChampionInfo & { key: number }> = champData.champions || {};

            for (const [ddragonName, ddragonInfo] of Object.entries(ddragonChampions)) {
                const resolvedName = NAME_OVERRIDES[ddragonName] || ddragonName;
                keyToName.set(ddragonInfo.key, resolvedName);

                if (enriched[resolvedName]) {
                    const champ = enriched[resolvedName];

                    champ.ddragonId = ddragonInfo.ddragonId;
                    champ.tags = ddragonInfo.tags;
                    champ.title = ddragonInfo.title;
                    champ.riotInfo = ddragonInfo.info;
                    champ.realStats = ddragonInfo.stats;
                    champ.image = ddragonInfo.image;
                    champ.isFreeRotation = false;

                    // ── Critical new fields from DDragon ──
                    champ.damageType = deriveDamageType(ddragonInfo.info);
                    champ.attackRange = deriveAttackRange(ddragonInfo.stats.attackRange);
                    // Gender from static map (already set above)

                    // Blend stats: 60% hand-tuned + 40% DDragon real
                    if (ddragonInfo.stats && ddragonInfo.info) {
                        const realDamage = normalizeDamage(ddragonInfo.stats.attackDamage, ddragonInfo.info.attack);
                        const realToughness = normalizeToughness(
                            ddragonInfo.stats.armor, ddragonInfo.stats.hp, ddragonInfo.info.defense,
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

        let freeRotationCount = 0;
        if (rotationRes.status === 'fulfilled' && rotationRes.value.ok) {
            const rotationData = await rotationRes.value.json();
            const freeIds = new Set<number>([
                ...(rotationData.freeChampionIds || []),
                ...(rotationData.freeChampionIdsForNewPlayers || []),
            ]);
            freeRotationCount = freeIds.size;

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
