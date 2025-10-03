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
  try {
    console.log("Generating recommendations for userId:", userId);
    console.log("Meal analysis:", mealAnalysis);
    
    const user = await findById(userId);
    if (!user) throw new Error("User not found");
    console.log("User found:", user);

    const profileSettings = await findProfileSettings(userId);
    console.log("Profile settings:", profileSettings);

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
    
    console.log("Profile object:", profile);

  const prompt = `You are a clinical-nutrition assistant. Based on the user profile and the analyzed meal, produce 4-6 personalized recommendations.
Return ONLY valid JSON inside a single \`\`\`json block with this exact schema:
\n\n\n\n\n\n\n\n\n\n\n\n`;

  const schema = {
    example: [
      {
        id: 1,
        type: "medical", 
        title: "Blood Sugar Management",
        subtitle: "Based on diabetes profile",
        message: "Pair carbs with protein and fiber to slow absorption.",
        meta: {
          mealTime: "Lunch (12:30 PM)",
          carbs: "65g",
          suggestion: "Add lean protein next meal",
        },
        createdAt: "just now",
        status: "new",
      },
    ],
  };

  const contentText = `USER_PROFILE:\n${JSON.stringify(profile)}\nMEAL_ANALYSIS:\n${JSON.stringify(
    mealAnalysis
  )}\n\nSCHEMA:\n${JSON.stringify(schema)}\n\nFollow the schema strictly. Return only JSON.`;

  const response = await model.invoke([
    new HumanMessage({
      content: [{ type: "text", text: contentText }],
    }),
  ]);

  console.log("AI Response:", response.content);

  const match = String(response.content).match(/```json\n([\s\S]*?)\n```/);
  const json = match ? match[1] : String(response.content);
  
  console.log("Extracted JSON:", json);
  
  const parsed = JSON.parse(json);
  console.log("Parsed recommendations:", parsed);
  
  return mapAiToCards(parsed);
  
  } catch (error) {
    console.error("Error in generateRecommendations:", error);
    throw error;
  }
};


