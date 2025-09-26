import { pool } from '../config/db.js';

export const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const create = async (email, hash) => {
  const [result] = await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);
  return { id: result.insertId, email };
};
