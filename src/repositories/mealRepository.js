import { pool } from "../config/db.js";

export const getMealsWFood = async (userId) => {
const [rows] = await pool.query(
    `SELECT m.*, f.food_id, f.name AS food_name, f.calories_per_unit AS food_calories, f.carbs AS food_carbs, f.proteins AS food_proteins, f.fats AS food_fats, f.sodium AS food_sodium, f.fiber AS food_fiber
     FROM meals m
     LEFT JOIN Food_Items f ON m.meal_id = f.meal_id
     WHERE m.user_id = ?
     ORDER BY m.timestamp DESC, f.id`,
    [userId]
);

// Group foods by meal
const mealsMap = {};
for (const row of rows) {
    if (!mealsMap[row.id]) {
        mealsMap[row.id] = {
            id: row.id,
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
        };
    }
    if (row.food_id) {
        mealsMap[row.id].foods.push({
            id: row.food_id,
            name: row.food_name,
            calories: row.food_calories,
            carbs: row.food_carbs,
            proteins: row.food_proteins,
            fats: row.food_fats,
            sodium: row.food_sodium,
            fiber: row.food_fiber,
        });
    }
}
return Object.values(mealsMap);
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
