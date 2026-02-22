import { NextResponse } from 'next/server';

const RIOT_ROTATION_URL =
    'https://na1.api.riotgames.com/lol/platform/v3/champion-rotations';

export async function GET() {
    const apiKey = process.env.RIOT_API_KEY;

    // Return mock data if key is missing or if in mock mode
    if (!apiKey || process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
        console.warn('[Riot API] Key missing or mock mode enabled. Returning mock rotation data.');
        return NextResponse.json({
            freeChampionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Example IDs: Annie, Olaf, Galio, etc.
            freeChampionIdsForNewPlayers: [222, 254, 427, 82, 131, 147, 54, 17, 18, 37],
            maxNewPlayerLevel: 10,
            timestamp: new Date().toISOString(),
            mock: true,
        });
    }

    try {
        const res = await fetch(RIOT_ROTATION_URL, {
            headers: { 'X-Riot-Token': apiKey },
            next: { revalidate: 3600 },
        });

        if (res.status === 403) {
            console.warn('[Riot API] Key expired or invalid. Returning mock rotation data.');
             return NextResponse.json({
                freeChampionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                freeChampionIdsForNewPlayers: [222, 254, 427, 82, 131, 147, 54, 17, 18, 37],
                maxNewPlayerLevel: 10,
                timestamp: new Date().toISOString(),
                mock: true,
            });
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
