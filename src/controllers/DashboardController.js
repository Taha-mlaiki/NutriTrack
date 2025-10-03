import { pool } from '../config/db.js';
export const showDashboard = (req, res) => {
  res.render("layouts/dashboard", { error: null });
};

export const showHome = (req, res) => {
  res.render("layouts/main", { error: null });
};



export const getDashboardStats = async function getDashboardStats(req, res){

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
        result = {totalCalories : todayCalories, all : macros, goal : max};
        res.render("layouts/dashboard", result);
  // console.log(result);
}

