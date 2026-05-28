import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';


dotenv.config({
    path: './.env'
});
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log("Connecting to database with URL:", process.env.DATABASE_URL);

const db = drizzle(pool);
export default db;