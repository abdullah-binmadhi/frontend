import { Champion, Item, Build, TierListEntry, ItemStats, TimelinePoint, Matchup } from '@/lib/types';
import { mockChampions } from '@/lib/mock/champions';
import { mockItems, mockTierList } from '@/lib/mock/items';
import { mockBuilds } from '@/lib/mock/builds';
import { createClient } from '@/lib/supabase';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Helper to map DB snake_case to Frontend camelCase
const mapChampion = (c: any): Champion => ({
    ...c,
    imageUrl: c.image_url,
    stats: c.stats || {},
});

const mapItem = (i: any): Item => ({
    ...i,
    totalCost: i.total_cost,
    imageUrl: i.image_url,
    buildsFrom: i.builds_from || [],
    buildsInto: i.builds_into || [],
    patchVersion: i.patch_version,
    roles: i.roles || [],
});

export const api = {
    champions: {
        getAll: async () => {
            if (USE_MOCK) return mockChampions;
            const sb = createClient();
            const { data } = await sb.from('champions').select('*');
            return (data || []).map(mapChampion);
        },
        getById: async (id: number) => {
            if (USE_MOCK) return mockChampions.find((c) => c.id === id);
            const sb = createClient();
            const { data } = await sb.from('champions').select('*').eq('id', id).single();
            return data ? mapChampion(data) : undefined;
        },
        getMatchups: async (id: number) => {
            return []; // Not implemented in DB yet
        }
    },
    items: {
        getAll: async () => {
            if (USE_MOCK) return mockItems;
            const sb = createClient();
            const { data } = await sb.from('items').select('*');
            return (data || []).map(mapItem);
        },
        getById: async (id: number) => {
            if (USE_MOCK) return mockItems.find((i) => i.id === id);
            const sb = createClient();
            const { data } = await sb.from('items').select('*').eq('id', id).single();
            return data ? mapItem(data) : undefined;
        },
        getStats: async (id: number) => {
            return []; // Not implemented in DB yet
        },
        getTierList: async (params?: Record<string, string>) => {
            // Return ALL items as TierListEntry[] so the component has full metadata
            // for joining with live Supabase stats. Stats are placeholders — real stats
            // come from the item_tier_stats table at query time.
            return mockItems.map((item, i) => ({
                item,
                tier: ('S' as const),
                wpa: 0,
                winRate: 0,
                pickRate: 0,
                gamesPlayed: 0,
            }));
        },
    },
    builds: {
        getAll: async () => {
            if (USE_MOCK) return mockBuilds;
            const sb = createClient();
            const { data } = await sb.from('builds').select('*, profiles(username, avatar_url)');
            // Need mapping logic for builds if needed
            return data as any;
        },
        getById: async (id: string) => {
            // Check if it's a mock build ID (e.g. "Ahri-1")
            const mockBuild = mockBuilds.find((b) => b.id === id);

            if (mockBuild) {
                console.log('[API] Found mock build:', id);
                return mockBuild;
            }

            console.log('[API] Mock build not found for:', id, 'Available mocked:', mockBuilds.length);

            if (USE_MOCK) return undefined;

            // Prevent Supabase error for non-UUIDs (mock IDs are usually short like 'Ahri-1')
            if (id.length < 32 || !id.includes('-')) {
                console.log('[API] ID is not a UUID, skipping Supabase:', id);
                return undefined;
            }

            const sb = createClient();
            const { data, error } = await sb.from('builds').select('*').eq('id', id).single();
            if (error) console.error('[API] Supabase error:', error);
            return data as any;
        },
        create: async (build: Partial<Build>) => {
            if (USE_MOCK) {
                return { ...build, id: Date.now().toString(), createdAt: new Date().toISOString() } as Build;
            }
            const sb = createClient();
            const { data, error } = await sb.from('builds').insert(build).select().single();
            if (error) throw error;
            return data as any;
        },
    },
    ml: {
        getWinProbability: async () => []
    },
};
