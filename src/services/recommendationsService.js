

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


