import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  }
});

// create users table if not exists
const createUsersTable = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        provider VARCHAR(20) NOT NULL DEFAULT 'local',
        google_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    try {
      await pool.query(createTableQuery);

      // Lightweight "migration" for existing DBs created with older schema.
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) NOT NULL DEFAULT 'local';`);
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);`);
      await pool.query(`ALTER TABLE users ALTER COLUMN role DROP NOT NULL;`);

      console.log('Users table ready.');
    } catch (err) {
      console.error('Error creating users table', err);
    }
};

const createProfileTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS freelancer_profiles (
        id SERIAL PRIMARY KEY,
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        skills TEXT,
        portfolio TEXT,
        experience TEXT,
        hourly_rate DECIMAL(10,2),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_profiles (
        id SERIAL PRIMARY KEY,
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255),
        industry VARCHAR(255),
        bio TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Profile tables ready.');
  } catch (err) {
    console.error('Error creating profile tables', err);
  }
};

createUsersTable();
createProfileTables();
