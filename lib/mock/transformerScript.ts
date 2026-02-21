import fs from 'fs';
import path from 'path';

// Seeded random generator
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// 1. Process items.ts Generate Tier List Logic
const itemsPath = path.join(process.cwd(), 'lib/mock/items.ts');
let itemsData = fs.readFileSync(itemsPath, 'utf8');

const newTierListLogic = `function generateTierList(): TierListEntry[] {
    const tiers: ('S' | 'A' | 'B' | 'C')[] = ['S', 'A', 'B', 'C'];
    // Filter for tier list: cost > 2000 to exclude components
    const tierItems = mockItems.filter(i => i.totalCost > 2000);
    
    // Create a deterministic pseudo-random algorithm for realistic Patch 26.4 stats
    function pseudoRandom(seed: number) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    return tierItems.slice(0, Math.min(40, tierItems.length)).map((item, i) => {
        // Tie seeded variance to the item ID natively!
        const rand1 = pseudoRandom(item.id);
        const rand2 = pseudoRandom(item.id * 1.5);
        
        // Items in S tier should cluster higher natively, C tier lower natively
        // S = 0-7, A = 8-17, B = 18-29, C = 30-39
        const tierIndex = i < 8 ? 0 : i < 18 ? 1 : i < 30 ? 2 : 3;
        
        // Realistic WRs are heavily skewed between 47.0% and 54.5%
        const baseWrRange = tierIndex === 0 ? [0.525, 0.545] :
                            tierIndex === 1 ? [0.510, 0.524] :
                            tierIndex === 2 ? [0.495, 0.509] :
                                              [0.470, 0.494];
                                              
        const wrRand = rand1; 
        const wr = baseWrRange[0] + wrRand * (baseWrRange[1] - baseWrRange[0]);
        
        // WPA is usually -2.0 to +3.0
        const baseWpaRange = tierIndex === 0 ? [0.035, 0.050] :
                             tierIndex === 1 ? [0.010, 0.034] :
                             tierIndex === 2 ? [-0.015, 0.009] :
                                               [-0.035, -0.016];
                                               
        const wpaRand = pseudoRandom(item.id * 3.14);
        const wpa = baseWpaRange[0] + wpaRand * (baseWpaRange[1] - baseWpaRange[0]);
        
        // Games played scales exponentially downward
        const gamesPlayedBase = 250000 * Math.pow(0.85, i);
        const finalGamesPlayed = gamesPlayedBase * (0.8 + 0.4 * rand2);

        return {
            item,
            tier: tiers[tierIndex],
            wpa: +wpa.toFixed(3),
            winRate: +wr.toFixed(3),
            pickRate: +(0.15 * (finalGamesPlayed / 250000)).toFixed(3),
            gamesPlayed: Math.round(finalGamesPlayed),
        };
    });
}`;

itemsData = itemsData.replace(/function generateTierList\(\)[\s\S]*?\}\s*export const mockTierList/, newTierListLogic + '\n\nexport const mockTierList');
fs.writeFileSync(itemsPath, itemsData, 'utf8');

// 2. Process champions.ts hardcoded stats
const championsPath = path.join(process.cwd(), 'lib/mock/champions.ts');
let champsData = fs.readFileSync(championsPath, 'utf8');

champsData = champsData.replace(/stats:\s*\{\s*winRate:\s*[\d.]+,\s*pickRate:\s*[\d.]+,\s*banRate:\s*[\d.]+,\s*gamesPlayed:\s*[\d.]+,\s*avgKda:\s*[\d.]+\s*\}/g, (match, offset, string) => {
    // Extract ID safely using regex by looking backwards
    const extractContext = string.substring(Math.max(0, offset - 500), offset);
    const idMatch = extractContext.match(/id:\s*(\d+)/g);
    let id = 100; // default
    if (idMatch && idMatch.length > 0) {
        // Get the latest one
        const last = idMatch[idMatch.length - 1];
        id = parseInt(last.replace('id:', '').trim(), 10);
    }

    const rWr = seededRandom(id * 1.1);
    const rPr = seededRandom(id * 2.2);
    const rBr = seededRandom(id * 3.3);
    const rGp = seededRandom(id * 4.4);
    const rKda = seededRandom(id * 5.5);

    // Normal distribution-ish for Patch 26.4
    // Winrates hover tightly between 46.50% and 53.50%
    const winRate = 0.465 + rWr * (0.535 - 0.465);
    const pickRate = 0.01 + rPr * 0.15; // 1% to 16% pick rate
    const banRate = 0.005 + rBr * 0.25; // 0.5% to 25.5% ban rate
    const gamesPlayed = Math.round(50000 + rGp * 450000);
    const avgKda = 1.5 + rKda * 2.5; // 1.5 to 4.0 KDA

    return `stats: { winRate: ${+winRate.toFixed(3)}, pickRate: ${+pickRate.toFixed(3)}, banRate: ${+banRate.toFixed(3)}, gamesPlayed: ${gamesPlayed}, avgKda: ${+avgKda.toFixed(2)} }`;
});

fs.writeFileSync(championsPath, champsData, 'utf8');

console.log("Mock data completely transformed for Patch 26.4 bounds.");
