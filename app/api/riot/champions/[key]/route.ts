import { NextResponse } from 'next/server';

const DDRAGON_VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const DDRAGON_CHAMPION_URL = (version: string, key: string) =>
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${key}.json`;

interface DDragonSpell {
    id: string;
    name: string;
    description: string;
    image: { full: string };
    cooldownBurn: string;
    costBurn: string;
    rangeBurn: string;
}

interface DDragonPassive {
    name: string;
    description: string;
    image: { full: string };
}

interface DDragonSkin {
    id: string;
    num: number;
    name: string;
}

interface DDragonChampionFull {
    id: string;
    key: string;
    name: string;
    title: string;
    lore: string;
    tags: string[];
    info: { attack: number; defense: number; magic: number; difficulty: number };
    spells: DDragonSpell[];
    passive: DDragonPassive;
    skins: DDragonSkin[];
    allytips: string[];
    enemytips: string[];
    stats: Record<string, number>;
    image: { full: string };
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;

        // 1. Get latest DDragon version
        const versionsRes = await fetch(DDRAGON_VERSIONS_URL, { next: { revalidate: 3600 } });
        if (!versionsRes.ok) throw new Error('Failed to fetch DDragon versions');
        const versions: string[] = await versionsRes.json();
        const latestVersion = versions[0];

        // 2. Fetch full champion data
        const champRes = await fetch(DDRAGON_CHAMPION_URL(latestVersion, key), {
            next: { revalidate: 3600 },
        });
        if (!champRes.ok) throw new Error(`Failed to fetch champion: ${key}`);
        const champData = await champRes.json();
        const champ: DDragonChampionFull = champData.data[key];

        if (!champ) {
            return NextResponse.json({ error: 'Champion not found' }, { status: 404 });
        }

        // 3. Transform into rich detail format
        const detail = {
            id: champ.id,
            key: parseInt(champ.key, 10),
            name: champ.name,
            title: champ.title,
            lore: champ.lore,
            tags: champ.tags,
            info: champ.info,
            image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`,
            passive: {
                name: champ.passive.name,
                description: stripHtmlTags(champ.passive.description),
                image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/passive/${champ.passive.image.full}`,
            },
            spells: champ.spells.map((spell, i) => ({
                key: ['Q', 'W', 'E', 'R'][i],
                name: spell.name,
                description: stripHtmlTags(spell.description),
                image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${spell.image.full}`,
                cooldown: spell.cooldownBurn,
                cost: spell.costBurn,
                range: spell.rangeBurn,
            })),
            skins: champ.skins.map((skin) => ({
                id: skin.id,
                num: skin.num,
                name: skin.name === 'default' ? champ.name : skin.name,
                splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_${skin.num}.jpg`,
                loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.id}_${skin.num}.jpg`,
            })),
            tips: {
                ally: champ.allytips,
                enemy: champ.enemytips,
            },
            stats: champ.stats,
            version: latestVersion,
        };

        return NextResponse.json(detail);
    } catch (error) {
        console.error('[Riot API] Champion detail error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch champion detail', fallback: true },
            { status: 500 },
        );
    }
}

function stripHtmlTags(str: string): string {
    return str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
}
