import { useQuery } from '@tanstack/react-query';

export interface ChampionDetail {
    id: string;
    key: number;
    name: string;
    title: string;
    lore: string;
    tags: string[];
    info: { attack: number; defense: number; magic: number; difficulty: number };
    image: string;
    passive: {
        name: string;
        description: string;
        image: string;
    };
    spells: {
        key: string;
        name: string;
        description: string;
        image: string;
        cooldown: string;
        cost: string;
        range: string;
    }[];
    skins: {
        id: string;
        num: number;
        name: string;
        splash: string;
        loading: string;
    }[];
    tips: {
        ally: string[];
        enemy: string[];
    };
    stats: Record<string, number>;
    version: string;
}

async function fetchChampionDetail(key: string): Promise<ChampionDetail> {
    const res = await fetch(`/api/riot/champions/${key}`);
    if (!res.ok) throw new Error('Failed to fetch champion detail');
    return res.json();
}

export function useChampionDetail(key: string | undefined) {
    return useQuery({
        queryKey: ['champion-detail', key],
        queryFn: () => fetchChampionDetail(key!),
        staleTime: 5 * 60 * 1000,
        enabled: !!key,
    });
}
