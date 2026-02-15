import { Champion, Item, Build, TierListEntry, ItemStats, TimelinePoint, Matchup } from '@/lib/types';
import { mockChampions } from '@/lib/mock/champions';
import { mockItems, mockTierList } from '@/lib/mock/items';
import { mockBuilds } from '@/lib/mock/builds';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Default to TRUE (mock data) unless explicitly disabled
// This ensures Vercel deployments work out-of-the-box without complex backend setup
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

async function fetchApi<T>(endpoint: string): Promise<T> {
    if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300));
        return getMockData<T>(endpoint);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return json.data as T;
}

function getMockData<T>(endpoint: string): T {
    if (endpoint.startsWith('/champions/') && !endpoint.includes('/stats')) {
        const id = parseInt(endpoint.split('/')[2]);
        return (mockChampions.find((c) => c.id === id) || mockChampions[0]) as T;
    }
    if (endpoint === '/champions') return mockChampions as T;

    if (endpoint.startsWith('/items/') && !endpoint.includes('/stats') && !endpoint.includes('/tier-list')) {
        const id = parseInt(endpoint.split('/')[2]);
        return (mockItems.find((i) => i.id === id) || mockItems[0]) as T;
    }
    if (endpoint === '/items') return mockItems as T;
    if (endpoint.includes('/tier-list')) return mockTierList as T;

    if (endpoint.startsWith('/builds/') && endpoint.split('/').length === 3) {
        const id = endpoint.split('/')[2];
        return (mockBuilds.find((b) => b.id === id) || mockBuilds[0]) as T;
    }
    if (endpoint === '/builds') return mockBuilds as T;

    return [] as T;
}

export const api = {
    champions: {
        getAll: () => fetchApi<Champion[]>('/champions'),
        getById: (id: number) => fetchApi<Champion>(`/champions/${id}`),
        getMatchups: (id: number) => fetchApi<Matchup[]>(`/champions/${id}/matchups`),
    },
    items: {
        getAll: () => fetchApi<Item[]>('/items'),
        getById: (id: number) => fetchApi<Item>(`/items/${id}`),
        getStats: (id: number) => fetchApi<ItemStats[]>(`/items/${id}/stats`),
        getTierList: (params?: Record<string, string>) => {
            const qs = params ? '?' + new URLSearchParams(params).toString() : '';
            return fetchApi<TierListEntry[]>(`/items/tier-list${qs}`);
        },
    },
    builds: {
        getAll: () => fetchApi<Build[]>('/builds'),
        getById: (id: string) => fetchApi<Build>(`/builds/${id}`),
        create: async (build: Partial<Build>) => {
            if (USE_MOCK) {
                return { ...build, id: Date.now().toString(), createdAt: new Date().toISOString() } as Build;
            }
            const res = await fetch(`${API_BASE}/builds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(build),
            });
            const json = await res.json();
            return json.data as Build;
        },
    },
    ml: {
        getWinProbability: () =>
            fetchApi<TimelinePoint[]>('/ml/win-probability'),
    },
};
