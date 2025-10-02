import { model } from "../config/gemini.js";
import { HumanMessage } from "@langchain/core/messages";
import { findById } from "../repositories/userRepository.js";

export const mapAiToCards = (ai) => {
 
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

export const buildPromptFromProfileAndMeal = (profile, mealAnalysis) => {
  const schema = {
    example: [
      {
        id: 1,
        type: "nutrition",
        title: "Example",
        subtitle: "Why this matters",
        message: "Do X for reason Y",
        meta: { key: "value" },
        createdAt: "just now",
        status: "new",
      },
    ],
  };

  const contentText = `You are a clinical-nutrition assistant. Generate 4-6 actionable, safe recommendations based on the user profile and analyzed meal. Use the schema strictly and return ONLY JSON in a single code block.\n\nUSER_PROFILE:\n${JSON.stringify(
    profile
  )}\nMEAL_ANALYSIS:\n${JSON.stringify(mealAnalysis)}\nSCHEMA:\n${JSON.stringify(
    schema
  )}`;

  return contentText;
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

  const prompt = buildPromptFromProfileAndMeal(profile, mealAnalysis);

  const response = await model.invoke([
    new HumanMessage({ content: [{ type: "text", text: prompt }] }),
  ]);

  const match = String(response.content).match(/```json\n([\s\S]*?)\n```/);
  const json = match ? match[1] : String(response.content);
  const parsed = JSON.parse(json);
  return mapAiToCards(parsed);
};


