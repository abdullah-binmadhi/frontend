import { NextResponse } from 'next/server';

// Data Dragon endpoints (no API key needed)
const DDRAGON_VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const DDRAGON_CHAMPIONS_URL = (version: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;

interface DDragonChampion {
    id: string;
    key: string;
    name: string;
    title: string;
    tags: string[];
    info: { attack: number; defense: number; magic: number; difficulty: number };
    image: { full: string };
    stats: {
        hp: number;
        hpperlevel: number;
        mp: number;
        armor: number;
        armorperlevel: number;
        attackdamage: number;
        attackdamageperlevel: number;
        movespeed: number;
        attackrange: number;
    };
}

interface DDragonResponse {
    version: string;
    data: Record<string, DDragonChampion>;
}

export async function GET() {
    try {
        // 1. Get latest DDragon version
        const versionsRes = await fetch(DDRAGON_VERSIONS_URL, { next: { revalidate: 3600 } });
        if (!versionsRes.ok) throw new Error('Failed to fetch DDragon versions');
        const versions: string[] = await versionsRes.json();
        const latestVersion = versions[0];

        // 2. Get all champion data from DDragon
        const championsRes = await fetch(DDRAGON_CHAMPIONS_URL(latestVersion), {
            next: { revalidate: 3600 },
        });
        if (!championsRes.ok) throw new Error('Failed to fetch DDragon champion data');
        const championsData: DDragonResponse = await championsRes.json();

        // 3. Transform into our enrichment format
        const enriched: Record<
            string,
            {
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
        > = {};

        for (const [, champ] of Object.entries(championsData.data)) {
            enriched[champ.name] = {
                ddragonId: champ.id,
                key: parseInt(champ.key, 10),
                name: champ.name,
                title: champ.title,
                tags: champ.tags,
                image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`,
                info: champ.info,
                stats: {
                    hp: champ.stats.hp,
                    armor: champ.stats.armor,
                    attackDamage: champ.stats.attackdamage,
                    moveSpeed: champ.stats.movespeed,
                    attackRange: champ.stats.attackrange,
                },
            };
        }

        return NextResponse.json({
            version: latestVersion,
            timestamp: new Date().toISOString(),
            championCount: Object.keys(enriched).length,
            champions: enriched,
        });
    } catch (error) {
        console.error('[Riot API] Champions fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch champion data', fallback: true },
            { status: 500 },
        );
    }
}
