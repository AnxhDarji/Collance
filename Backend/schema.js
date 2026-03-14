import { pool } from './config/db.js';
const test = async () => {
    try {
        let res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';`);
        console.log('USERS COLUMNS:');
        res.rows.forEach(r => console.log(r.column_name, '-', r.data_type));

        res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'proposals';`);
        console.log('PROPOSALS COLUMNS:');
        res.rows.forEach(r => console.log(r.column_name, '-', r.data_type));
        
        res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'contracts';`);
        console.log('CONTRACTS COLUMNS:');
        res.rows.forEach(r => console.log(r.column_name, '-', r.data_type));
    } catch(e) {
        console.error(e);
    } finally { process.exit(0); }
};
test();
