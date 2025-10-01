import { pool } from "../config/db.js";

export const createFood = async (meal_id, foodData) => {
  const {
    name,
    carbs,
    fats,
    sodium,
    protein,
    fiber,
    calories_per_unit,
    glycemic_index,
  } = foodData;
  const [result] = await pool.query(
    "INSERT INTO Food_Items (meal_id, name, carbs,proteins, fats, sodium, fiber, calories_per_unit, glycemic_index) VALUES (?,?,?, ?, ?, ?, ?, ?, ?)",
    [
      meal_id,
      name,
      carbs,
      protein,
      fats,
      sodium,
      fiber,
      calories_per_unit,
      glycemic_index,
    ]
  );
  return { id: result.insertId, ...foodData };
};
