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

            // Fetch champions from DB
            const { data: champions, error: champError } = await sb
                .from('champions')
                .select('*');

            if (champError || !champions?.length) {
                console.warn('[API] Champions DB query failed, falling back to mock:', champError);
                return mockChampions;
            }

            // Fetch real aggregated stats from champion_stats table
            const { data: stats } = await sb
                .from('champion_stats')
                .select('*')
                .eq('role', 'All')
                .order('games_played', { ascending: false });

            // Build a stats lookup map
            const statsMap: Record<number, any> = {};
            for (const s of (stats || [])) {
                statsMap[s.champion_id] = {
                    winRate: s.win_rate,
                    pickRate: s.pick_rate,
                    banRate: s.ban_rate,
                    gamesPlayed: s.games_played,
                    avgKda: s.avg_kda,
                };
            }

            return champions.map((c: any) => {
                const mapped = mapChampion(c);
                // Override stats with real data if available
                if (statsMap[c.id]) {
                    mapped.stats = statsMap[c.id];
                }
                return mapped;
            });
        },
        getById: async (id: number) => {
            if (USE_MOCK) return mockChampions.find((c) => c.id === id);
            const sb = createClient();

            const { data, error } = await sb
                .from('champions')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                console.warn('[API] Champion by ID failed, falling back to mock:', error);
                return mockChampions.find((c) => c.id === id);
            }

            // Fetch real stats for this champion
            const { data: stats } = await sb
                .from('champion_stats')
                .select('*')
                .eq('champion_id', id)
                .eq('role', 'All')
                .order('updated_at', { ascending: false })
                .limit(1);

            const mapped = mapChampion(data);
            if (stats && stats.length > 0) {
                mapped.stats = {
                    winRate: stats[0].win_rate,
                    pickRate: stats[0].pick_rate,
                    banRate: stats[0].ban_rate,
                    gamesPlayed: stats[0].games_played,
                    avgKda: stats[0].avg_kda,
                };
            }
            return mapped;
        },
        getMatchups: async (id: number) => {
            return []; // Not implemented yet
        }
    },
    items: {
        getAll: async () => {
            if (USE_MOCK) return mockItems;
            const sb = createClient();
            const { data, error } = await sb.from('items').select('*');
            if (error || !data?.length) {
                console.warn('[API] Items query failed, falling back to mock:', error);
                return mockItems;
            }
            return data.map(mapItem);
        },
        getById: async (id: number) => {
            if (USE_MOCK) return mockItems.find((i) => i.id === id);
            const sb = createClient();
            const { data, error } = await sb.from('items').select('*').eq('id', id).single();
            if (error || !data) {
                return mockItems.find((i) => i.id === id);
            }
            return mapItem(data);
        },
        getStats: async (id: number) => {
            return []; // Not implemented in DB yet
        },
        getTierList: async (params?: Record<string, string>) => {
            // Return ALL items as TierListEntry[] so the component has full metadata
            // for joining with live Supabase stats. The ItemTierList component
            // fetches actual stats from item_tier_stats table at query time.
            if (USE_MOCK) return mockTierList;

            const sb = createClient();
            const { data: items, error } = await sb.from('items').select('*');
            if (error || !items?.length) {
                console.warn('[API] Items for tier list failed, using mock items for metadata');
                return mockItems.map((item) => ({
                    item,
                    tier: 'S' as const,
                    wpa: 0,
                    winRate: 0,
                    pickRate: 0,
                    gamesPlayed: 0,
                }));
            }

            return items.map((i: any) => ({
                item: mapItem(i),
                tier: 'S' as const,
                wpa: 0,
                winRate: 0,
                pickRate: 0,
                gamesPlayed: 0,
            }));
        },
    },
    builds: {
        getAll: async () => {
            // Builds remain mock-sourced; they are curated templates
            // similar to how community sites provide pre-built recommendations
            return mockBuilds;
        },
        getById: async (id: string) => {
            // Check mock builds first (they cover all champions)
            const mockBuild = mockBuilds.find((b) => b.id === id);
            if (mockBuild) return mockBuild;

            if (USE_MOCK) return undefined;

            // Prevent Supabase error for non-UUIDs
            if (id.length < 32 || !id.includes('-')) return undefined;

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
