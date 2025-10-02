import { model } from "../config/gemini.js";
import { findById } from "../repositories/userRepository.js";
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

  const profile = {
    id: user.id,
    name: user.name,
    profile_type: user.profile_type,
    age: user.age ?? null,
    gender: user.gender ?? null,
    weight: user.weight ?? null,
    height: user.height ?? null,
    goals: user.goals ?? null,
  };

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

  const match = String(response.content).match(/```json\n([\s\S]*?)\n```/);
  const json = match ? match[1] : String(response.content);
  const parsed = JSON.parse(json);
  return mapAiToCards(parsed);
};


