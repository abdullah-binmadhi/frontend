import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Assuming run from `frontend` directory
dotenv.config({ path: '.env.local' });

async function run() {
    const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
    if (!connectionString) {
        console.error('Missing POSTGRES_URL_NON_POOLING or POSTGRES_URL in .env.local');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }, // Required for Supabase in many environments
    });

    try {
        await client.connect();
        console.log('Connected to database...');

        // Adjusted path to migration file (up one level to root supabase folder)
        const sqlPath = path.join(process.cwd(), '../supabase/migrations/20260216000000_init_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        await client.query(sql);
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
