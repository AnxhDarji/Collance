import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Successfully connected to Neon PostgreSQL at', res.rows[0].now);
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
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    try {
      await pool.query(createTableQuery);
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