import fs from "fs";
import { model } from "../config/gemini.js";
import { HumanMessage } from "@langchain/core/messages";
import { createFood } from "../services/foodService.js";
import {
  createMeal,
  getMealsWFood,
  deleteMeal as deleteMealService,
} from "../services/mealService.js";
import path from "path";

export const showMeal = (req, res) => {
  res.render("mealLogging/meal", { error: null });
};

export const analyzeMeal = async (req, res) => {
  if (!req.file) {
    throw new Error("No Image is detected");
  }

  const user = req.session.user;

  console.log(user);

  try {
    const imageBase64 = fs.readFileSync(req.file.path, "base64");
    const prompt = `
      You are a nutrition analysis tool. Analyze the meal in the provided image. Identify each food item and estimate: calories_per_unit, carbs (g), protein (g), fats (g), sodium (mg), fiber (g) , glycemic_index . Calculate totals for all items. Provide feedback on the meal's nutritional balance (e.g., suggest improvements based on general health goals). Return **only** valid JSON wrapped in \`\`\`json\n...\n\`\`\`, with no additional text or comments. Use this exact structure:
      \`\`\`json
      {
        "foods": [
          { "name": "example", "calories_per_unit": 0, "carbs": 0, "protein": 0, "fats": 0, "sodium": 0, "fiber": 0 ,"glycemic_index": 0},
        ],
        "totals": { "calories": 0, "carbs": 0, "protein": 0, "fats": 0, "sodium": 0, "fiber": 0 },
      }
      \`\`\`
    `;

    const response = await model.invoke([
      new HumanMessage({
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
        ],
      }),
    ]);

    // Extract JSON from ```json...``` block
    const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("No valid JSON found in model response");
    }

    const nutritionData = JSON.parse(jsonMatch[1]); // Parse the extracted JSON
    res.json(nutritionData);

    fs.unlinkSync(req.file.path); // Clean up file
  } catch (err) {
    console.error("Error processing meal:", err.message);
    res.status(500).json({ error: `Failed to analyze meal: ${err.message}` });
  }
};

export const uploadMeal = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // if (!req.session?.user?.id)
    //   return res.status(401).json({ error: "Not authenticated" });

    // const userId = req.session.user.id;
    const userId = 1;
    const { foods, totals } = req.body;

    // Parse if JSON strings
    const parsedFood = req.body.foods ? JSON.parse(foods) : undefined;
    const parsedTotal = req.body.totals ? JSON.parse(totals) : undefined;

    console.log({ parsedFood, parsedTotal });

    // Save image in public/meals
    const fileExt = path.extname(req.file.originalname);
    const fileName = `meal_${userId}_${Date.now()}${fileExt}`;
    const publicPath = path.join("public", "meals", fileName);
    fs.renameSync(req.file.path, publicPath); // move file

    const imageUrl = `/meals/${fileName}`;

    const meal = await createMeal(userId, {
      image_url: imageUrl,
      calories: parsedTotal?.calories || 0,
      carbs: parsedTotal?.carbs || 0,
      proteins: parsedTotal?.protein || 0,
      fats: parsedTotal?.fats || 0,
      sodium: parsedTotal?.sodium || 0,
      fiber: parsedTotal?.fiber || 0,
    });
    const mealId = meal.id;
    for (const key of parsedFood || []) {
      await createFood(mealId, {
        name: key.name,
        calories_per_unit: key.calories_per_unit || 0,
        carbs: key.carbs || 0,
        proteins: key.protein || 0,
        fats: key.fats || 0,
        sodium: key.sodium || 0,
        fiber: key.fiber || 0,
        glycemic_index: key.glycemic_index || 0,
      });
    }

    res.json({ message: "Meal uploaded successfully", mealId, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to upload meal: ${err.message}` });
  }
};

export const getMealHistory = async (req, res) => {
  try {
    const meals = await getMealsWFood(1);
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch meals: ${err.message}` });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ error: "Meal ID is required" });
    const result = await deleteMealService(req.params.id);
    if (result) {
      return res.status(200).json({ message: "Meal deleted successfully" });
    } else {
      return res.status(404).json({ error: "Meal not found" });
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
