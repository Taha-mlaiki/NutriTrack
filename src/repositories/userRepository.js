import { pool } from "../config/db.js";

export const findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

export const create = async (fullName, email, hash, profile_type) => {
  const [result] = await pool.query(
    "INSERT INTO users (name,email, password,profile_type) VALUES (?, ? , ? , ?)",
    [fullName, email, hash, profile_type]
  );
  return { id: result.insertId, email };
};

export const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const findProfileSettings = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM Profile_Settings WHERE user_id = ?", [userId]);
  return rows[0];
};