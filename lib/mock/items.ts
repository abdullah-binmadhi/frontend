import { Item, TierListEntry } from '@/lib/types';

const DDRAGON_VERSION = '14.1.1';
const BASE_IMG = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item`;

export const mockItems: Item[] = [
    {
        id: 3031, name: 'Infinity Edge', description: 'Massively empowers critical strikes.',
        totalCost: 3400, purchasable: true, mythic: false,
        stats: { attackDamage: 70, criticalStrike: 20 }, tags: ['Damage', 'CriticalStrike'],
        buildsFrom: [1038, 1018, 1036], buildsInto: [],
        imageUrl: `${BASE_IMG}/3031.png`, patchVersion: '14.1',
    },
    {
        id: 6672, name: 'Kraken Slayer', description: 'Every third attack deals bonus true damage.',
        totalCost: 3400, purchasable: true, mythic: false,
        stats: { attackDamage: 40, attackSpeed: 35, criticalStrike: 20 }, tags: ['Damage', 'AttackSpeed'],
        buildsFrom: [1043, 1037, 1018], buildsInto: [],
        imageUrl: `${BASE_IMG}/6672.png`, patchVersion: '14.1',
    },
    {
        id: 3089, name: "Rabadon's Deathcap", description: 'Increases Ability Power by 35%.',
        totalCost: 3600, purchasable: true, mythic: false,
        stats: { abilityPower: 120 }, tags: ['SpellDamage'],
        buildsFrom: [1058, 1026], buildsInto: [],
        imageUrl: `${BASE_IMG}/3089.png`, patchVersion: '14.1',
    },
    {
        id: 3071, name: 'Black Cleaver', description: 'Dealing physical damage to an enemy champion reduces their Armor.',
        totalCost: 3100, purchasable: true, mythic: false,
        stats: { attackDamage: 40, health: 450, abilityHaste: 25 }, tags: ['Damage', 'Health', 'CooldownReduction'],
        buildsFrom: [3133, 3044], buildsInto: [],
        imageUrl: `${BASE_IMG}/3071.png`, patchVersion: '14.1',
    },
    {
        id: 3153, name: "Blade of the Ruined King", description: 'Basic attacks deal bonus damage based on target health.',
        totalCost: 3300, purchasable: true, mythic: false,
        stats: { attackDamage: 40, attackSpeed: 25, lifeSteal: 8 }, tags: ['Damage', 'AttackSpeed', 'LifeSteal'],
        buildsFrom: [1053, 1042, 3144], buildsInto: [],
        imageUrl: `${BASE_IMG}/3153.png`, patchVersion: '14.1',
    },
    {
        id: 3157, name: "Zhonya's Hourglass", description: 'Become invulnerable for 2.5 seconds.',
        totalCost: 3250, purchasable: true, mythic: false,
        stats: { abilityPower: 105, armor: 50, abilityHaste: 10 }, tags: ['SpellDamage', 'Armor'],
        buildsFrom: [3191, 3108], buildsInto: [],
        imageUrl: `${BASE_IMG}/3157.png`, patchVersion: '14.1',
    },
    {
        id: 6653, name: "Liandry's Torment", description: 'Dealing ability damage burns enemies.',
        totalCost: 3200, purchasable: true, mythic: false,
        stats: { abilityPower: 90, health: 300 }, tags: ['SpellDamage', 'Health'],
        buildsFrom: [3108, 3116], buildsInto: [],
        imageUrl: `${BASE_IMG}/6653.png`, patchVersion: '14.1',
    },
    {
        id: 3046, name: 'Phantom Dancer', description: 'Gain movement speed and attack speed.',
        totalCost: 2600, purchasable: true, mythic: false,
        stats: { attackSpeed: 30, criticalStrike: 20, movementSpeed: 7 }, tags: ['AttackSpeed', 'CriticalStrike'],
        buildsFrom: [1042, 1018, 3086], buildsInto: [],
        imageUrl: `${BASE_IMG}/3046.png`, patchVersion: '14.1',
    },
    {
        id: 3036, name: "Lord Dominik's Regards", description: 'Overcomes enemies with high health.',
        totalCost: 3000, purchasable: true, mythic: false,
        stats: { attackDamage: 30, criticalStrike: 20, armorPenetration: 35 }, tags: ['Damage', 'ArmorPenetration'],
        buildsFrom: [3035, 1036], buildsInto: [],
        imageUrl: `${BASE_IMG}/3036.png`, patchVersion: '14.1',
    },
    {
        id: 3065, name: 'Spirit Visage', description: 'Increases all healing and shielding received.',
        totalCost: 2900, purchasable: true, mythic: false,
        stats: { health: 450, magicResistance: 60, abilityHaste: 10 }, tags: ['Health', 'SpellBlock'],
        buildsFrom: [3211, 3067], buildsInto: [],
        imageUrl: `${BASE_IMG}/3065.png`, patchVersion: '14.1',
    },
];

export const mockTierList: TierListEntry[] = [
    { item: mockItems[0], tier: 'S', wpa: 0.067, winRate: 0.582, pickRate: 0.723, gamesPlayed: 184000 },
    { item: mockItems[1], tier: 'S', wpa: 0.055, winRate: 0.568, pickRate: 0.645, gamesPlayed: 156000 },
    { item: mockItems[2], tier: 'S', wpa: 0.061, winRate: 0.575, pickRate: 0.689, gamesPlayed: 172000 },
    { item: mockItems[3], tier: 'A', wpa: 0.042, winRate: 0.548, pickRate: 0.512, gamesPlayed: 134000 },
    { item: mockItems[4], tier: 'A', wpa: 0.038, winRate: 0.541, pickRate: 0.478, gamesPlayed: 128000 },
    { item: mockItems[5], tier: 'A', wpa: 0.035, winRate: 0.536, pickRate: 0.534, gamesPlayed: 145000 },
    { item: mockItems[6], tier: 'B', wpa: 0.022, winRate: 0.521, pickRate: 0.356, gamesPlayed: 98000 },
    { item: mockItems[7], tier: 'B', wpa: 0.018, winRate: 0.515, pickRate: 0.312, gamesPlayed: 87000 },
    { item: mockItems[8], tier: 'C', wpa: 0.005, winRate: 0.504, pickRate: 0.234, gamesPlayed: 67000 },
    { item: mockItems[9], tier: 'C', wpa: -0.002, winRate: 0.497, pickRate: 0.189, gamesPlayed: 52000 },
];
