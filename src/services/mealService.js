import {
  createMeal as createMealRepo,
  getMealsWFood as getMealsWFoodRepo,
} from "../repositories/mealRepository.js";

export const getMealsWFood = async (user_id) => {
  const meals = await getMealsWFoodRepo(user_id);
  return meals;
};

export const createMeal = async (user_id, mealData) => {
  const meal = await createMealRepo(user_id, mealData);
  if (!meal) throw new Error("Meal could not be created");
  return meal;
};
