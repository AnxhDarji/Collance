import { pool } from './config/db.js';

const fixDb = async () => {
    try {
        await pool.query('DROP TABLE IF EXISTS contracts CASCADE');
        await pool.query('DROP TABLE IF EXISTS proposals CASCADE');
        await pool.query('DROP TABLE IF EXISTS projects CASCADE');
        console.log("DROPPED");

        await pool.query(`
            CREATE TABLE projects (
                id SERIAL PRIMARY KEY,
                project_code VARCHAR(50) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                budget DECIMAL(10,2),
                client_id INTEGER REFERENCES users(id),
                status VARCHAR(50) DEFAULT 'open',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Projects table ready.');
        
        await pool.query(`
            CREATE TABLE proposals (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id),
                freelancer_id INTEGER REFERENCES users(id),
                message TEXT,
                price DECIMAL(10,2),
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Proposals table ready.');
        
        await pool.query(`
            CREATE TABLE contracts (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id),
                client_id INTEGER REFERENCES users(id),
                freelancer_id INTEGER REFERENCES users(id),
                proposal_id INTEGER REFERENCES proposals(id),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Contracts table ready.');
        
        process.exit(0);
    } catch(e) {
        console.error("ERRORRR:", e.message);
        process.exit(1);
    }
}
fixDb();
