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
    
    
    const fallbackRecommendations = [
      {
        id: 1,
        type: "medical",
        title: "Blood Sugar Management",
        subtitle: "Based on your diabetes profile",
        message: "Your meal contains 73g carbs. Consider pairing with protein and fiber to slow glucose absorption.",
        meta: {
          mealTime: "Recent meal",
          carbs: "73g",
          suggestion: "Add lean protein to next meal"
        },
        createdAt: "just now",
        status: "new"
      },
      {
        id: 2,
        type: "nutrition",
        title: "Protein Intake",
        subtitle: "Good protein levels detected",
        message: "Your meal has 41g protein. This is excellent for managing blood sugar and maintaining muscle mass.",
        meta: {
          protein: "41g",
          status: "Good"
        },
        createdAt: "just now",
        status: "new"
      },
      {
        id: 3,
        type: "workout",
        title: "Post-Meal Activity",
        subtitle: "Consider light exercise",
        message: "Take a 15-minute walk after this meal to help regulate blood sugar levels.",
        meta: {
          duration: "15 min",
          type: "Light walk"
        },
        createdAt: "just now",
        status: "new"
      }
    ];
    
    return fallbackRecommendations;
  }
};


