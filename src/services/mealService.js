import {
  createMeal as createMealRepo,
  getMealsWFood as getMealsWFoodRepo,
  findMealById as findMealByIdRepo,
  deleteMealById as deleteMealRepo,
} from "../repositories/mealRepository.js";
import path from "path";
import fs from "fs";

export const getMealsWFood = async (user_id) => {
  const meals = await getMealsWFoodRepo(user_id);
  return meals;
};

export const createMeal = async (user_id, mealData) => {
  const meal = await createMealRepo(user_id, mealData);
  if (!meal) throw new Error("Meal could not be created");
  return meal;
};

export const deleteMeal = async (mealId) => {
  // Implement meal deletion logic here
  const meal = await findMealByIdRepo(mealId);
  if (!meal) throw new Error("Meal not found");
  const result = await deleteMealRepo(mealId);
  if (meal.image_url) {
    const imagePath = path.join("public", meal.image_url.replace(/^\/+/, ""));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  return result;
};
