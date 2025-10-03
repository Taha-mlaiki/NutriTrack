import { pool } from "../config/db.js";
export const showDashboard = (req, res) => {
  res.render("layouts/dashboard", { error: null });
};

export const showHome = (req, res) => {
  res.render("layouts/main", { error: null });
};

export const getDashboardStats = async function getDashboardStats(req, res) {
  const userId = 1;
  let result = {};
  const [todayCalories] = await pool.query(
    `SELECT SUM(calories) as total 
             FROM meals 
             WHERE user_id = ? 
    `,
    [userId]
  );
  const [macros] = await pool.query(
    `SELECT 
                SUM(proteins) as totalProtein,
                SUM(carbs) as totalCarbs,
                SUM(fats) as totalFats
             FROM meals
             WHERE user_id = ?`,
    [userId]
  );

  const [max] = await pool.query(
    `SELECT max_carbs, max_sodium, min_proteins, calorie_target
       FROM Profile_Settings
       WHERE user_id = ?`,
    [userId]
  );
  const [recent] = await pool.query(
    `SELECT m.meal_id,
       m.timestamp,
       m.calories,
       m.carbs,
       m.proteins,
       m.fats,
       m.image_url,
       fi.name AS food_name
       FROM Meals m
       JOIN Food_Items fi ON m.meal_id = fi.meal_id
       WHERE m.user_id = ?
       ORDER BY m.timestamp DESC
       LIMIT 2;`,
    [userId]
  );

  result = {
    totalCalories: todayCalories,
    all: macros,
    goal: max,
    recentMeals: recent,
  };
  res.render("layouts/dashboard", result);
  // console.log(result);
};
