import { model } from "../config/gemini.js";
import { findById, findProfileSettings } from "../repositories/userRepository.js";
import { HumanMessage } from "@langchain/core/messages";

const mapAiToCards = (ai) => {
  if (!Array.isArray(ai)) return [];
  return ai.map((r, idx) => ({
    id: r.id ?? idx + 1,
    type: r.type ?? "nutrition",
    title: r.title ?? "Recommendation",
    subtitle: r.subtitle ?? "",
    message: r.message ?? "",
    meta: r.meta ?? {},
    createdAt: r.createdAt ?? "just now",
    status: r.status ?? "new",
  }));
};

export const generateRecommendations = async ({ userId, mealAnalysis }) => {
  const user = await findById(userId);
  if (!user) throw new Error("User not found");

  const profileSettings = await findProfileSettings(userId);

  const profile = {
    id: user.id,
    name: user.name,
    profile_type: user.profile_type,
    age: user.age ?? null,
    gender: user.gender ?? null,
    weight: user.weight ?? null,
    height: user.height ?? null,
    max_carbs: profileSettings?.max_carbs ?? null,
    max_sodium: profileSettings?.max_sodium ?? null,
    min_proteins: profileSettings?.min_proteins ?? null,
    calorie_target: profileSettings?.calorie_target ?? null,
  };

  const prompt = `You are a clinical nutritionist. Generate 4 personalized recommendations based on this user profile and meal analysis.

USER PROFILE:
- Name: ${profile.name}
- Profile Type: ${profile.profile_type}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Weight: ${profile.weight}kg
- Height: ${profile.height}cm
- Max Carbs: ${profile.max_carbs}g
- Max Sodium: ${profile.max_sodium}mg
- Min Proteins: ${profile.min_proteins}g
- Calorie Target: ${profile.calorie_target}cal

MEAL ANALYSIS:
- Calories: ${mealAnalysis.totals?.calories || 0}
- Carbs: ${mealAnalysis.totals?.carbs || 0}g
- Protein: ${mealAnalysis.totals?.protein || 0}g
- Fats: ${mealAnalysis.totals?.fats || 0}g
- Sodium: ${mealAnalysis.totals?.sodium || 0}mg
- Fiber: ${mealAnalysis.totals?.fiber || 0}g

Return ONLY a JSON array with exactly this format:
[
  {
    "id": 1,
    "type": "medical",
    "title": "Recommendation Title",
    "subtitle": "Brief subtitle",
    "message": "Detailed recommendation message",
    "meta": {
      "key": "value"
    },
    "createdAt": "just now",
    "status": "new"
  }
]

Use types: medical, nutrition, workout, hydration, weight`;

  try {
    const response = await model.invoke([
      new HumanMessage({
        content: [{ type: "text", text: prompt }],
      }),
    ]);

    console.log("AI Response:", response.content);

    
    let jsonText = String(response.content);
    
    
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonText);
    console.log("Parsed recommendations:", parsed);
    
    return mapAiToCards(parsed);
    
  } catch (error) {
    console.error("AI Error:", error);
    
    
    return [
      {
        id: 1,
        type: "medical",
        title: "Blood Sugar Management",
        subtitle: "Based on your diabetes profile",
        message: `Your meal contains ${mealAnalysis.totals?.carbs || 0}g carbs. Consider pairing with protein and fiber to slow glucose absorption.`,
        meta: { carbs: `${mealAnalysis.totals?.carbs || 0}g` },
        createdAt: "just now",
        status: "new"
      }
    ];
  }
};