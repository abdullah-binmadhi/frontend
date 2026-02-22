#!/usr/bin/env node

/**
 * seed-real-stats.mjs
 * 
 * Fetches real match data from Riot Games API and populates
 * champion_stats and item_tier_stats tables in Supabase.
 * 
 * Run locally (no edge function timeout):
 *   node scripts/seed-real-stats.mjs
 * 
 * Requires: RIOT_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// Load env vars from frontend/.env.local (works from both root and frontend/)
let envPath;
try {
    envPath = resolve(__dirname, '../frontend/.env.local');
    readFileSync(envPath);
} catch {
    envPath = resolve(__dirname, '.env.local');
}
try {
    envPath = resolve(process.cwd(), '.env.local');
    readFileSync(envPath);
} catch {
    // Already set
}
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].replace(/^"|"$/g, '').trim();
    }
}

const RIOT_API_KEY = env.RIOT_API_KEY || env.NEXT_PUBLIC_RIOT_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!RIOT_API_KEY) { console.error('RIOT_API_KEY not found'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Supabase credentials not found'); process.exit(1); }

console.log('🔑 Riot API Key:', RIOT_API_KEY.slice(0, 10) + '...');
console.log('🔗 Supabase URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const POSITION_MAP = {
    TOP: 'Top', JUNGLE: 'Jungle', MIDDLE: 'Mid', BOTTOM: 'ADC', UTILITY: 'Support',
};

const REGIONS = [
    { platform: 'na1', routing: 'americas' },
];

const QUEUE_RANKED_SOLO = 420;
const DELAY_MS = 1250; // Stay under 20 req/s

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function riotFetch(url) {
    await delay(DELAY_MS);
    const resp = await fetch(url, { headers: { 'X-Riot-Token': RIOT_API_KEY } });

    if (resp.status === 429) {
        const retryAfter = parseInt(resp.headers.get('Retry-After') || '10', 10);
        console.log(`⏳ Rate limited, waiting ${retryAfter}s...`);
        await delay(retryAfter * 1000);
        return riotFetch(url); // Retry
    }

    if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`Riot API ${resp.status}: ${body.slice(0, 200)}`);
    }
    return resp.json();
}

async function main() {
    const startTime = Date.now();

    // Get current patch
    const versions = await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json();
    const patchShort = versions[0].split('.').slice(0, 2).join('.');
    console.log(`📋 Current patch: ${patchShort}`);

    // Step 1: Get high-elo PUUIDs
    console.log('\n━━━ Step 1: Collecting PUUIDs ━━━');
    const puuids = new Set();

    for (const region of REGIONS) {
        for (const tier of ['challengerleagues', 'grandmasterleagues']) {
            try {
                const url = `https://${region.platform}.api.riotgames.com/lol/league/v4/${tier}/by-queue/RANKED_SOLO_5x5`;
                const data = await riotFetch(url);
                const top = (data.entries || [])
                    .sort((a, b) => b.leaguePoints - a.leaguePoints)
                    .slice(0, 10);

                for (const entry of top) {
                    try {
                        const summoner = await riotFetch(
                            `https://${region.platform}.api.riotgames.com/lol/summoner/v4/summoners/${entry.summonerId}`
                        );
                        puuids.add(summoner.puuid);
                        process.stdout.write(`\r  PUUIDs: ${puuids.size}`);
                    } catch (e) {
                        console.warn(`  ⚠ Failed summoner: ${e.message}`);
                    }
                }
            } catch (e) {
                console.warn(`  ⚠ Failed ${tier}: ${e.message}`);
            }
        }
    }
    console.log(`\n  ✅ Collected ${puuids.size} PUUIDs`);

    // Step 2: Get match IDs
    console.log('\n━━━ Step 2: Fetching Match IDs ━━━');
    const matchIds = new Set();

    for (const puuid of puuids) {
        try {
            const ids = await riotFetch(
                `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${QUEUE_RANKED_SOLO}&count=10`
            );
            ids.forEach(id => matchIds.add(id));
            process.stdout.write(`\r  Match IDs: ${matchIds.size}`);
        } catch (e) {
            console.warn(`  ⚠ Failed matches: ${e.message}`);
        }
    }
    console.log(`\n  ✅ Collected ${matchIds.size} unique match IDs`);

    // Step 3: Fetch match details
    console.log('\n━━━ Step 3: Fetching Match Details ━━━');
    const matchData = [];
    let fetched = 0;
    const matchArr = [...matchIds];

    for (const matchId of matchArr) {
        try {
            const routing = matchId.startsWith('NA') ? 'americas' :
                matchId.startsWith('EUW') ? 'europe' :
                    matchId.startsWith('KR') ? 'asia' : 'americas';

            const match = await riotFetch(
                `https://${routing}.api.riotgames.com/lol/match/v5/matches/${matchId}`
            );

            if (!match.info || match.info.queueId !== QUEUE_RANKED_SOLO) continue;

            const participants = match.info.participants.map(p => ({
                championId: p.championId,
                teamPosition: p.teamPosition,
                win: p.win,
                kills: p.kills,
                deaths: p.deaths,
                assists: p.assists,
                totalMinionsKilled: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0),
                goldEarned: p.goldEarned || 0,
                item0: p.item0, item1: p.item1, item2: p.item2,
                item3: p.item3, item4: p.item4, item5: p.item5,
                teamId: p.teamId,
            }));

            const bans = (match.info.teams || []).flatMap(t =>
                (t.bans || []).map(b => b.championId)
            );

            matchData.push({ matchId, participants, bans });
            fetched++;
            process.stdout.write(`\r  Fetched: ${fetched}/${matchArr.length}`);
        } catch (e) {
            console.warn(`  ⚠ Failed ${matchId}: ${e.message}`);
        }
    }
    console.log(`\n  ✅ Fetched ${matchData.length} matches`);

    if (matchData.length === 0) {
        console.error('❌ No match data fetched. Check API key.');
        process.exit(1);
    }

    // Cache matches in Supabase
    console.log('\n━━━ Caching matches ━━━');
    const cacheRows = matchData.map(m => ({
        match_id: m.matchId,
        region: 'americas',
        game_version: patchShort,
        game_duration: 0,
        queue_id: QUEUE_RANKED_SOLO,
        participants: { participants: m.participants, bans: m.bans },
    }));

    for (let i = 0; i < cacheRows.length; i += 100) {
        const batch = cacheRows.slice(i, i + 100);
        const { error } = await supabase.from('match_cache').upsert(batch, { onConflict: 'match_id' });
        if (error) console.error('  ⚠ Cache error:', error.message);
    }
    console.log(`  ✅ Cached ${cacheRows.length} matches`);

    // Step 4: Aggregate champion stats
    console.log('\n━━━ Step 4: Aggregating Champion Stats ━━━');
    const champAcc = {};
    const banAcc = {};
    let totalParticipants = 0;
    const roleGameCounts = {};

    for (const match of matchData) {
        for (const banId of (match.bans || [])) {
            if (banId > 0) banAcc[banId] = (banAcc[banId] || 0) + 1;
        }

        for (const p of match.participants) {
            const role = POSITION_MAP[p.teamPosition];
            if (!role) continue;

            totalParticipants++;
            roleGameCounts[role] = (roleGameCounts[role] || 0) + 1;

            for (const key of [`${p.championId}_${role}`, `${p.championId}_All`]) {
                if (!champAcc[key]) champAcc[key] = { wins: 0, games: 0, kills: 0, deaths: 0, assists: 0, cs: 0, gold: 0 };
                champAcc[key].games++;
                if (p.win) champAcc[key].wins++;
                champAcc[key].kills += p.kills;
                champAcc[key].deaths += p.deaths;
                champAcc[key].assists += p.assists;
                champAcc[key].cs += p.totalMinionsKilled;
                champAcc[key].gold += p.goldEarned;
            }
        }
    }

    const totalBanSlots = matchData.length * 10;
    const statsRows = [];

    for (const [key, acc] of Object.entries(champAcc)) {
        const [champIdStr, ...roleParts] = key.split('_');
        const role = roleParts.join('_');
        const champId = parseInt(champIdStr);

        const winRate = +(acc.wins / acc.games).toFixed(4);
        const roleTotal = role === 'All' ? totalParticipants : (roleGameCounts[role] || 1);
        const pickRate = +(acc.games / roleTotal).toFixed(4);
        const banRate = +((banAcc[champId] || 0) / totalBanSlots).toFixed(4);
        const avgKda = acc.deaths > 0 ? +((acc.kills + acc.assists) / acc.deaths).toFixed(2) : +(acc.kills + acc.assists).toFixed(2);

        statsRows.push({
            champion_id: champId,
            role,
            patch: patchShort,
            win_rate: winRate,
            pick_rate: pickRate,
            ban_rate: banRate,
            games_played: acc.games,
            avg_kda: avgKda,
            avg_cs: +(acc.cs / acc.games).toFixed(0),
            avg_gold: +(acc.gold / acc.games).toFixed(0),
            updated_at: new Date().toISOString(),
        });
    }

    console.log(`  Generated ${statsRows.length} champion stat rows`);

    for (let i = 0; i < statsRows.length; i += 200) {
        const batch = statsRows.slice(i, i + 200);
        const { error } = await supabase.from('champion_stats').upsert(batch, { onConflict: 'champion_id, role, patch' });
        if (error) console.error('  ⚠ Stats error:', error.message);
    }

    // Update champions table
    const allRoleStats = statsRows.filter(r => r.role === 'All');
    for (const stat of allRoleStats) {
        await supabase.from('champions').update({
            stats: {
                winRate: stat.win_rate,
                pickRate: stat.pick_rate,
                banRate: stat.ban_rate,
                gamesPlayed: stat.games_played,
                avgKda: stat.avg_kda,
            }
        }).eq('id', stat.champion_id);
    }

    console.log(`  ✅ Inserted ${statsRows.length} champion stats, updated ${allRoleStats.length} champions`);

    // Step 5: Aggregate item stats
    console.log('\n━━━ Step 5: Aggregating Item Stats ━━━');
    const { data: itemsData } = await supabase.from('items').select('id, total_cost, tags');
    const validItemIds = new Set((itemsData || []).map(i => i.id));
    const itemCat = {};
    for (const item of (itemsData || [])) {
        const tags = item.tags || [];
        const cost = item.total_cost || 0;
        if (tags.includes('Boots')) itemCat[item.id] = 'Boots';
        else if (cost < 500) itemCat[item.id] = 'Starter';
        else if (cost >= 2000) itemCat[item.id] = 'Legendaries';
        else itemCat[item.id] = 'Components';
    }

    const itemAcc = {};
    const roleWr = {};

    for (const match of matchData) {
        for (const p of match.participants) {
            const role = POSITION_MAP[p.teamPosition];
            if (!role) continue;

            for (const r of [role, 'All']) {
                if (!roleWr[r]) roleWr[r] = { wins: 0, games: 0 };
                roleWr[r].games++;
                if (p.win) roleWr[r].wins++;
            }

            const items = [];
            for (const s of ['item0', 'item1', 'item2', 'item3', 'item4', 'item5']) {
                if (p[s] > 0 && validItemIds.has(p[s])) items.push(p[s]);
            }
            const unique = [...new Set(items)];

            const SLOTS = ['1st', '2nd', '3rd', '4th+'];
            for (let i = 0; i < unique.length; i++) {
                const id = unique[i];
                const cat = itemCat[id] || 'Components';
                const slot = i < 3 ? SLOTS[i] : SLOTS[3];

                for (const r of [role, 'All']) {
                    for (const c of [cat, 'All']) {
                        for (const sl of [slot, 'All']) {
                            const key = `${id}_${r}_${sl}_${c}`;
                            if (!itemAcc[key]) itemAcc[key] = { wins: 0, games: 0 };
                            itemAcc[key].games++;
                            if (p.win) itemAcc[key].wins++;
                        }
                    }
                }
            }
        }
    }

    const itemRows = [];
    for (const [key, stats] of Object.entries(itemAcc)) {
        const parts = key.split('_');
        const itemId = parseInt(parts[0]);
        const role = parts[1];
        const slot = parts[2];
        const category = parts[3];
        if (stats.games < 3) continue;

        const winRate = +(stats.wins / stats.games).toFixed(4);
        const roleTotal = roleWr[role]?.games || 1;
        const pickRate = +(stats.games / roleTotal).toFixed(4);
        const baseline = roleWr[role] ? roleWr[role].wins / roleWr[role].games : 0.5;
        const wpa = +(winRate - baseline).toFixed(4);

        itemRows.push({ item_id: itemId, patch: patchShort, role, slot, category, win_rate: winRate, pick_rate: pickRate, games_played: stats.games, wpa });
    }

    // Clear and insert
    await supabase.from('item_tier_stats').delete().neq('item_id', 0);
    for (let i = 0; i < itemRows.length; i += 500) {
        const batch = itemRows.slice(i, i + 500);
        const { error } = await supabase.from('item_tier_stats').upsert(batch, { onConflict: 'item_id, patch, role, slot, category' });
        if (error) console.error('  ⚠ Item stats error:', error.message);
    }

    console.log(`  ✅ Inserted ${itemRows.length} item tier stat rows`);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 Done in ${elapsed}s!`);
    console.log(`   Champions with stats: ${allRoleStats.length}`);
    console.log(`   Total champion stat rows: ${statsRows.length}`);
    console.log(`   Total item stat rows: ${itemRows.length}`);
    console.log(`   Matches processed: ${matchData.length}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
