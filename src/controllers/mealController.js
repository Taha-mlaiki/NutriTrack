import fs from "fs";
import { model } from "../config/gemini.js";
import { HumanMessage } from "@langchain/core/messages";

export const showMeal = (req, res) => {
  res.render("mealLogging/meal", { error: null });
};

export const analyzeMeal = async (req, res) => {
  if (!req.file) {
    throw new Error("No Image is detected");
  }

  try {
    const imageBase64 = fs.readFileSync(req.file.path, "base64");
    const prompt = `
      You are a nutrition analysis tool. Analyze the meal in the provided image. Identify each food item and estimate: calories, carbs (g), protein (g), fats (g), sodium (mg), fiber (g). Calculate totals for all items. Provide feedback on the meal's nutritional balance (e.g., suggest improvements based on general health goals). Return **only** valid JSON wrapped in \`\`\`json\n...\n\`\`\`, with no additional text or comments. Use this exact structure:
      \`\`\`json
      {
        "foods": [
          { "name": "example", "calories": 0, "carbs": 0, "protein": 0, "fats": 0, "sodium": 0, "fiber": 0 }
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

    console.log("Raw model response:", response.content); // Debug log

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



export const uploadMeal = async ()=>{

}
