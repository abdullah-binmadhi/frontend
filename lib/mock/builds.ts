import { Build, Champion } from '@/lib/types';
import { mockChampions } from '@/lib/mock/champions';

const RUNES = {
    Precision: {
        primary: 'Precision',
        keystones: [
            { name: 'Conqueror', icon: 'perk-images/Styles/Precision/Conqueror/Conqueror.png' },
            { name: 'Lethal Tempo', icon: 'perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png' },
            { name: 'Press the Attack', icon: 'perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png' },
            { name: 'Fleet Footwork', icon: 'perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png' }
        ],
        tier1: [
            { name: 'Triumph', icon: 'perk-images/Styles/Precision/Triumph.png' },
            { name: 'Presence of Mind', icon: 'perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png' },
            { name: 'Absorb Life', icon: 'perk-images/Styles/Precision/AbsorbLife/AbsorbLife.png' }
        ],
        tier2: [
            { name: 'Legend: Alacrity', icon: 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png' },
            { name: 'Legend: Haste', icon: 'perk-images/Styles/Precision/LegendHaste/LegendHaste.png' },
            { name: 'Legend: Bloodline', icon: 'perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png' }
        ],
        tier3: [
            { name: 'Coup de Grace', icon: 'perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png' },
            { name: 'Cut Down', icon: 'perk-images/Styles/Precision/CutDown/CutDown.png' },
            { name: 'Last Stand', icon: 'perk-images/Styles/Precision/LastStand/LastStand.png' }
        ],
    },
    Domination: {
        primary: 'Domination',
        keystones: [
            { name: 'Electrocute', icon: 'perk-images/Styles/Domination/Electrocute/Electrocute.png' },
            { name: 'Dark Harvest', icon: 'perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png' },
            { name: 'Hail of Blades', icon: 'perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png' }
        ],
        tier1: [
            { name: 'Cheap Shot', icon: 'perk-images/Styles/Domination/CheapShot/CheapShot.png' },
            { name: 'Taste of Blood', icon: 'perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png' },
            { name: 'Sudden Impact', icon: 'perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png' }
        ],
        tier2: [
            { name: 'Zombie Ward', icon: 'perk-images/Styles/Domination/ZombieWard/ZombieWard.png' },
            { name: 'Ghost Poro', icon: 'perk-images/Styles/Domination/GhostPoro/GhostPoro.png' },
            { name: 'Eyeball Collection', icon: 'perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png' }
        ],
        tier3: [
            { name: 'Treasure Hunter', icon: 'perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png' },
            { name: 'Relentless Hunter', icon: 'perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png' },
            { name: 'Ultimate Hunter', icon: 'perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png' }
        ],
    },
    Sorcery: {
        primary: 'Sorcery',
        keystones: [
            { name: 'Arcane Comet', icon: 'perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png' },
            { name: 'Summon Aery', icon: 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png' },
            { name: 'Phase Rush', icon: 'perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png' }
        ],
        tier1: [
            { name: 'Null-Mystifying Orb', icon: 'perk-images/Styles/Sorcery/NullifyingOrb/Pokeshield.png' },
            { name: 'Manaflow Band', icon: 'perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png' },
            { name: 'Nimbus Cloak', icon: 'perk-images/Styles/Sorcery/NimbusCloak/6361.png' }
        ],
        tier2: [
            { name: 'Transcendence', icon: 'perk-images/Styles/Sorcery/Transcendence/Transcendence.png' },
            { name: 'Celerity', icon: 'perk-images/Styles/Sorcery/Celerity/CelerityTemp.png' },
            { name: 'Absolute Focus', icon: 'perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png' }
        ],
        tier3: [
            { name: 'Scorch', icon: 'perk-images/Styles/Sorcery/Scorch/Scorch.png' },
            { name: 'Waterwalking', icon: 'perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png' },
            { name: 'Gathering Storm', icon: 'perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png' }
        ],
    },
    Resolve: {
        primary: 'Resolve',
        keystones: [
            { name: 'Grasp of the Undying', icon: 'perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png' },
            { name: 'Aftershock', icon: 'perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png' },
            { name: 'Guardian', icon: 'perk-images/Styles/Resolve/Guardian/Guardian.png' }
        ],
        tier1: [
            { name: 'Demolish', icon: 'perk-images/Styles/Resolve/Demolish/Demolish.png' },
            { name: 'Font of Life', icon: 'perk-images/Styles/Resolve/FontOfLife/FontOfLife.png' },
            { name: 'Shield Bash', icon: 'perk-images/Styles/Resolve/MirrorShell/MirrorShell.png' }
        ],
        tier2: [
            { name: 'Conditioning', icon: 'perk-images/Styles/Resolve/Conditioning/Conditioning.png' },
            { name: 'Second Wind', icon: 'perk-images/Styles/Resolve/SecondWind/SecondWind.png' },
            { name: 'Bone Plating', icon: 'perk-images/Styles/Resolve/BonePlating/BonePlating.png' }
        ],
        tier3: [
            { name: 'Overgrowth', icon: 'perk-images/Styles/Resolve/Overgrowth/Overgrowth.png' },
            { name: 'Revitalize', icon: 'perk-images/Styles/Resolve/Revitalize/Revitalize.png' },
            { name: 'Unflinching', icon: 'perk-images/Styles/Resolve/Unflinching/Unflinching.png' }
        ],
    },
    Inspiration: {
        primary: 'Inspiration',
        keystones: [
            { name: 'Glacial Augment', icon: 'perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png' },
            { name: 'First Strike', icon: 'perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png' }
        ],
        tier1: [
            { name: 'Hextech Flashtraption', icon: 'perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png' },
            { name: 'Magical Footwear', icon: 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png' },
            { name: 'Cash Back', icon: 'perk-images/Styles/Inspiration/CashBack/CashBack.png' }
        ],
        tier2: [
            { name: 'Triple Tonic', icon: 'perk-images/Styles/Inspiration/TripleTonic/TripleTonic.png' },
            { name: 'Time Warp Tonic', icon: 'perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png' },
            { name: 'Biscuit Delivery', icon: 'perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png' }
        ],
        tier3: [
            { name: 'Cosmic Insight', icon: 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png' },
            { name: 'Approach Velocity', icon: 'perk-images/Styles/Inspiration/ApproachVelocity/ApproachVelocity.png' },
            { name: 'Jack Of All Trades', icon: 'perk-images/Styles/Inspiration/JackOfAllTrades/JackOfAllTrades.png' }
        ],
    },
};

const SECONDARY_PATHS = ['Domination', 'Sorcery', 'Resolve', 'Inspiration', 'Precision'];

const BUILD_TYPES: Record<string, { name: string; desc: string; core: number[]; fullBuild: number[]; situational: number[] }[]> = {
    Fighter: [
        { name: 'Bruiser Sustain', desc: 'Standard conqueror setup for extended fights.', core: [6630, 3053, 6333], fullBuild: [3111, 6630, 3053, 6333, 3065, 3143], situational: [3065, 3111] },
        { name: 'Lethality Burst', desc: 'Glass cannon build for deleting squishies.', core: [6691, 3142, 3147], fullBuild: [3158, 6691, 3142, 3147, 3026, 3156], situational: [3026, 3156] },
        { name: 'Crit Duelist', desc: 'High DPS build perfect for splitpushing.', core: [6671, 3031, 3046], fullBuild: [3006, 6671, 3031, 3046, 3072, 3036], situational: [3072, 3036] },
        { name: 'Tanky Engage', desc: 'Sacrifice some damage for survivability.', core: [6662, 3068, 3075], fullBuild: [3047, 6662, 3068, 3075, 3193, 3143], situational: [3193, 3143] },
        { name: 'Ability Haste', desc: 'Spam abilities with max CDR.', core: [6631, 3071, 3158], fullBuild: [3158, 6631, 3071, 3074, 6609, 3143], situational: [3074, 6609] },
    ],
    Mage: [
        { name: 'Ludens Burst', desc: 'Maximize poke and one-shot potential.', core: [6653, 3089, 3020], fullBuild: [3020, 6653, 3157, 3089, 3135, 4645], situational: [3135, 3157] },
        { name: 'Liandry Burn', desc: 'Melt tanks with % HP damage over time.', core: [6655, 3116, 3151], fullBuild: [3020, 6655, 3116, 3151, 3165, 4629], situational: [3165, 4629] },
        { name: 'Everfrost CC', desc: 'Lock down enemies for your team.', core: [6656, 3157, 4628], fullBuild: [3158, 6656, 3157, 4628, 3102, 3089], situational: [3102, 3041] },
        { name: 'RoA Scaling', desc: 'Scale safely into a late game monster.', core: [6657, 3040, 3003], fullBuild: [3020, 6657, 3040, 3003, 3135, 3089], situational: [3135, 3089] },
        { name: 'Full Magic Pen', desc: 'True damage to squishy targets.', core: [3020, 4645, 3135], fullBuild: [3020, 3152, 4645, 3135, 3089, 3157], situational: [3089, 3152] },
    ],
    Marksman: [
        { name: 'Kraken Slayer DPS', desc: 'Shred tanks with true damage.', core: [6672, 3031, 3046], fullBuild: [3006, 6672, 3031, 3046, 3036, 3153], situational: [3036, 3153] },
        { name: 'Galeforce Mobility', desc: 'Extra dash to outplay opponents.', core: [6671, 3095, 3031], fullBuild: [3006, 6671, 3095, 3031, 3026, 3072], situational: [3026, 3072] },
        { name: 'Shieldbow Safety', desc: 'Survive burst with lifeline shield.', core: [6673, 3004, 3072], fullBuild: [3006, 6673, 3004, 3072, 3046, 6676], situational: [3046, 6676] },
        { name: 'Lethality Poke', desc: 'Long range execution build.', core: [6692, 3142, 3158], fullBuild: [3158, 6692, 3142, 6694, 3004, 6695], situational: [6694, 3004] },
        { name: 'On-Hit Shred', desc: 'Attack speed focus with Guillsoos.', core: [3124, 6675, 3153], fullBuild: [3006, 3124, 6675, 3153, 3085, 3091], situational: [3085, 3091] },
    ],
    Assassin: [
        { name: 'Prowlers One-Shot', desc: 'Gap close and execute.', core: [6693, 3142, 3147], fullBuild: [3158, 6693, 3142, 3147, 3156, 6695], situational: [3156, 6695] },
        { name: 'Duskblade Invisibility', desc: 'Teamfight resets and confusion.', core: [6691, 3071, 3142], fullBuild: [3158, 6691, 3071, 3142, 3161, 3026], situational: [3161, 3026] },
        { name: 'Eclipse Dueling', desc: 'Shielding and % pen for skirmishes.', core: [6692, 3071, 3156], fullBuild: [3111, 6692, 3071, 3156, 3036, 3147], situational: [3036, 3147] },
        { name: 'Gore Drinker Sustain', desc: 'tankier assassin playstyle.', core: [6630, 3074, 3053], fullBuild: [3111, 6630, 3074, 3053, 6333, 3026], situational: [6333, 3026] },
        { name: 'Crit Assassin', desc: 'Hybrid burst with critical strikes.', core: [6676, 3031, 3095], fullBuild: [3006, 6676, 3031, 3095, 3072, 3036], situational: [3072, 3036] },
    ],
    AP_Assassin: [
        { name: 'AP Burst Assassin', desc: 'One-shot squishy backliners from stealth.', core: [3152, 4645, 3089], fullBuild: [3020, 3152, 4645, 3089, 3157, 3135], situational: [3157, 3102, 3135] },
        { name: 'Lich Bane On-Hit', desc: 'High single-target execution damage.', core: [3152, 3100, 3089], fullBuild: [3020, 3152, 3100, 3089, 4645, 3157], situational: [4628, 3157, 3135] },
        { name: 'Magic Penetration', desc: 'Shred through base magic resist.', core: [3152, 4645, 3135], fullBuild: [3020, 3152, 4645, 3135, 3089, 3102], situational: [3157, 3102, 3116] },
        { name: 'Sustained Fighter AP', desc: 'Survive in longer fights with riftmaker.', core: [4633, 3116, 3157], fullBuild: [3020, 4633, 3116, 3157, 3089, 3135], situational: [3102, 4629] },
        { name: 'Movespeed AP Burst', desc: 'Uncatchable AP burst threat.', core: [3152, 4629, 3089], fullBuild: [3020, 3152, 4629, 3089, 3157, 3135], situational: [3157, 3102, 4645] },
    ],
    Tank: [
        { name: 'Sunfire Burn', desc: 'Immolate enemies in prolonged fights.', core: [6662, 3068, 3075], fullBuild: [3047, 6662, 3068, 3075, 3193, 3143], situational: [3193, 3143] },
        { name: 'Frostfire Slow', desc: 'Stick to targets with icy zones.', core: [6664, 3111, 3083], fullBuild: [3111, 6664, 3083, 3143, 3001, 4401], situational: [3001, 4401] },
        { name: 'Chemtank Engage', desc: 'Speed boost to start fights.', core: [6660, 3742, 3143], fullBuild: [3047, 6660, 3742, 3143, 3075, 3065], situational: [3075, 3065] },
        { name: 'Heartsteel Stacking', desc: 'Infinite HP scaling.', core: [3084, 3083, 3001], fullBuild: [3111, 3084, 3083, 3001, 3075, 3068], situational: [3075, 3068] },
        { name: 'Support Tank', desc: 'Peel for your carry.', core: [3190, 3050, 3109], fullBuild: [3111, 3190, 3050, 3109, 3107, 3001], situational: [3107, 3001] },
    ],
    Support: [
        { name: 'Enchanter Utility', desc: 'Buff and heal your allies.', core: [3174, 3003, 3504], fullBuild: [3158, 3174, 3003, 3504, 3107, 6616], situational: [3107, 6616] },
        { name: 'Engage Support', desc: 'Lock down targets.', core: [3190, 3050, 3109], fullBuild: [3158, 3190, 3050, 3109, 3001, 3075], situational: [3001, 3075] },
        { name: 'Mage Support', desc: 'Carry from the bot lane.', core: [6653, 3020, 4645], fullBuild: [3020, 6653, 4645, 3157, 3165, 3089], situational: [3157, 3165] },
        { name: 'Shurelyas Speed', desc: 'Zoom your team into battle.', core: [2065, 3504, 3115], fullBuild: [3158, 2065, 3504, 3115, 3011, 3107], situational: [3011, 3107] },
        { name: 'Moonstone Sustain', desc: 'Maximum healing output.', core: [6617, 3003, 3107], fullBuild: [3158, 6617, 3003, 3107, 3158, 3222], situational: [3158, 3222] },
    ]
};

const DEFAULT_BUILDS = BUILD_TYPES.Fighter; // Fallback

function generateBuilds(): Build[] {
    const builds: Build[] = [];
    let idCounter = 1;

    mockChampions.forEach((champ) => {
        // Determine primary role/tag to select build templates
        let primaryTag = champ.tags[0];
        // Hardcode AP Assassins
        const AP_ASSASSINS = ['Akali', 'Evelynn', 'Katarina', 'Fizz', 'Diana', 'Ekko', 'LeBlanc'];
        if (AP_ASSASSINS.includes(champ.key)) {
            primaryTag = 'AP_Assassin';
        }

        const templates = BUILD_TYPES[primaryTag] || DEFAULT_BUILDS;

        templates.forEach((template, index) => {
            // Generate some entropy for upvotes/views to look real
            const upvotes = Math.floor(Math.random() * 2000) + 50;
            const views = upvotes * (Math.floor(Math.random() * 40) + 10);

            // Pseudo-random runes based on index
            const runeTreeKeys = Object.keys(RUNES);
            const primaryTreeKey = runeTreeKeys[index % runeTreeKeys.length];
            const primaryTree = RUNES[primaryTreeKey as keyof typeof RUNES];

            const secondaryTreeKey = SECONDARY_PATHS[(index + 2) % SECONDARY_PATHS.length] as keyof typeof RUNES;
            const secondaryTree = RUNES[secondaryTreeKey];

            builds.push({
                id: `${champ.key}-${index + 1}`,
                championId: champ.id,
                name: template.name,
                description: template.desc,
                position: getPositionFromTag(primaryTag),
                coreItems: template.core,
                fullBuildItems: template.fullBuild,
                situationalItems: template.situational,
                startingItems: [1055], // Doran's Blade/Shield/Ring generic ID
                isPublic: true,
                upvotes,
                views,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
                author: `Player${Math.floor(Math.random() * 9000) + 1000}`,
                runes: {
                    primary: {
                        path: primaryTree.primary,
                        keystone: primaryTree.keystones[index % primaryTree.keystones.length],
                        perks: [
                            primaryTree.tier1[index % 3],
                            primaryTree.tier2[(index + 1) % 3],
                            primaryTree.tier3[(index + 2) % 3],
                        ]
                    },
                    secondary: {
                        path: secondaryTree.primary,
                        perks: [
                            secondaryTree.tier1[(index * 2) % 3],
                            secondaryTree.tier2[(index * 2 + 1) % 3],
                        ]
                    },
                    statMods: [
                        { name: 'Adaptive Force', icon: 'perk-images/StatMods/StatModsAdaptiveForceIcon.png' },
                        { name: 'Adaptive Force', icon: 'perk-images/StatMods/StatModsAdaptiveForceIcon.png' },
                        { name: 'Armor', icon: 'perk-images/StatMods/StatModsArmorIcon.png' }
                    ]
                },
                skillOrder: generateSkillOrder(primaryTag),
                tips: [
                    `Focus on farming until you have your first core item (${template.core[0]}).`,
                    "Use your power spike at level 6 to look for roaming opportunities.",
                    "In teamfights, prioritize peeling for your carries or diving the enemy backline depending on your role.",
                    "Vision is key; buy control wards whenever you have spare gold.",
                    "Adjust your situational items based on who is fed on the enemy team."
                ]
            });
        });
    });

    return builds;
}

function getPositionFromTag(tag: string): 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'SUPPORT' {
    switch (tag) {
        case 'Tank': return 'TOP';
        case 'Fighter': return 'TOP';
        case 'Mage': return 'MIDDLE';
        case 'Assassin': return 'MIDDLE';
        case 'AP_Assassin': return 'MIDDLE';
        case 'Marksman': return 'BOTTOM';
        case 'Support': return 'SUPPORT';
        default: return 'TOP';
    }
}

function generateSkillOrder(tag: string): string[] {
    // Generic skill orders
    if (tag === 'Marksman') return ['Q', 'E', 'W', 'Q', 'Q', 'R', 'Q', 'W', 'Q', 'W', 'R', 'W', 'W', 'E', 'E'];
    if (tag === 'Mage') return ['Q', 'W', 'E', 'Q', 'Q', 'R', 'Q', 'W', 'Q', 'W', 'R', 'W', 'W', 'E', 'E'];
    return ['Q', 'E', 'W', 'Q', 'Q', 'R', 'Q', 'E', 'Q', 'E', 'R', 'E', 'E', 'W', 'W'];
}

export const mockBuilds: Build[] = generateBuilds();
