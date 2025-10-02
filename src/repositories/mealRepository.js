import { pool } from "../config/db.js";

export const getMealsWFood = async (userId) => {
  const [rows] = await pool.query(
    `SELECT m.*, f.food_id, f.name AS food_name, f.calories_per_unit AS food_calories, f.carbs AS food_carbs, f.proteins AS food_proteins, f.fats AS food_fats, f.sodium AS food_sodium, f.fiber AS food_fiber
     FROM meals m
     LEFT JOIN Food_items f ON m.meal_id = f.meal_id
     WHERE m.user_id = ?
     ORDER BY m.timestamp DESC, f.meal_id`,
    [userId]
  );

  // Group foods by meal as an array
  const mealsMap = new Map();
  for (const row of rows) {
    if (!mealsMap.has(row.meal_id)) {
      mealsMap.set(row.meal_id, {
        meal_id: row.meal_id,
        user_id: row.user_id,
        calories: row.calories,
        carbs: row.carbs,
        proteins: row.proteins,
        fats: row.fats,
        sodium: row.sodium,
        fiber: row.fiber,
        image_url: row.image_url,
        timestamp: row.timestamp,
        foods: [],
      });
    }
    if (row.food_id) {
      mealsMap.get(row.meal_id).foods.push({
        food_id: row.food_id,
        name: row.food_name,
        calories_per_unit: row.food_calories,
        carbs: row.food_carbs,
        proteins: row.food_proteins,
        fats: row.food_fats,
        sodium: row.food_sodium,
        fiber: row.food_fiber,
      });
    }
  }
  return Array.from(mealsMap.values());
};

export const createMeal = async (userId, mealData) => {
  const { calories, carbs, proteins, fats, sodium, fiber, image_url } =
    mealData;
  const [result] = await pool.query(
    "INSERT INTO meals (user_id, calories, carbs,proteins, fats, sodium, fiber, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [userId, calories, carbs, proteins, fats, sodium, fiber, image_url]
  );
  return { id: result.insertId, ...mealData };
};

export const findMealById = async (mealId) => {
  const [rows] = await pool.query("SELECT * FROM meals WHERE meal_id = ?", [
    mealId,
  ]);
  return rows[0];
};

export const deleteMealById = async (mealId) => {
  const [result] = await pool.query("DELETE FROM meals WHERE meal_id = ?", [
    mealId,
  ]);
  await pool.query(
    "DELETE FROM Food_items WHERE meal_id = ?",
    [mealId]
  );
  return result.affectedRows > 0;
};
