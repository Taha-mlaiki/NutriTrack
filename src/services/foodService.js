import {createFood as createFoodRepo} from "../repositories/foodRepository.js";

export const createFood = async (meal_id, foodData) => {
  const food = await createFoodRepo(meal_id, foodData);
  if (!food) throw new Error("Food item could not be created");
  return food;
};
