import { NextResponse } from 'next/server';

const RIOT_ROTATION_URL =
    'https://na1.api.riotgames.com/lol/platform/v3/champion-rotations';

export async function GET() {
    const apiKey = process.env.RIOT_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'RIOT_API_KEY not configured', fallback: true },
            { status: 503 },
        );
    }

    try {
        const res = await fetch(RIOT_ROTATION_URL, {
            headers: { 'X-Riot-Token': apiKey },
            next: { revalidate: 3600 },
        });

        if (res.status === 403) {
            return NextResponse.json(
                { error: 'API key expired or invalid', fallback: true },
                { status: 403 },
            );
        }

        if (!res.ok) {
            throw new Error(`Riot API returned ${res.status}`);
        }

        const data = await res.json();

        return NextResponse.json({
            freeChampionIds: data.freeChampionIds || [],
            freeChampionIdsForNewPlayers: data.freeChampionIdsForNewPlayers || [],
            maxNewPlayerLevel: data.maxNewPlayerLevel || 10,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[Riot API] Rotation fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rotation data', fallback: true },
            { status: 500 },
        );
    }
}
