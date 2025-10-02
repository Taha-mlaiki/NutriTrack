

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


