
import { Client } from 'pg';
import dotenv from 'dotenv';
import { mockItems } from '@/lib/mock/items';
import { mockChampions } from '@/lib/mock/champions';

dotenv.config({ path: '.env.local' });

async function seed() {
    const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
    if (!connectionString) {
        console.error('Missing POSTGRES_URL');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log('Connected to database for seeding...');

        // Clear existing data (optional, but safer for re-runs)
        await client.query('TRUNCATE TABLE public.items, public.champions CASCADE');
        console.log('Cleared existing data.');

        // Insert Champions
        console.log(`Seeding ${mockChampions.length} champions...`);
        for (const champ of mockChampions) {
            await client.query(
                `INSERT INTO public.champions (id, key, name, title, tags, stats, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
                [
                    champ.id,
                    champ.key,
                    champ.name,
                    champ.title,
                    champ.tags,
                    JSON.stringify(champ.stats),
                    champ.imageUrl
                ]
            );
        }
        console.log('Champions seeded.');

        // Insert Items
        console.log(`Seeding ${mockItems.length} items...`);
        for (const item of mockItems) {
            await client.query(
                `INSERT INTO public.items (id, name, description, total_cost, purchasable, mythic, stats, tags, roles, builds_from, builds_into, image_url, patch_version)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO NOTHING`,
                [
                    item.id,
                    item.name,
                    item.description,
                    item.totalCost,
                    item.purchasable,
                    item.mythic,
                    JSON.stringify(item.stats),
                    item.tags,
                    item.roles,
                    item.buildsFrom,
                    item.buildsInto,
                    item.imageUrl,
                    item.patchVersion
                ]
            );
        }
        console.log('Items seeded.');

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await client.end();
    }
}

seed();
