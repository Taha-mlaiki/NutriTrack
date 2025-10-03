import { pool } from './src/config/db.js';

async function test() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('DB connected! Test result:', rows);
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
}

test();
