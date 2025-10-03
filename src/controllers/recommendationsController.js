import { generateRecommendations } from "../services/recommendationsService.js";




export const showRecommendations = (req, res) => {
  const { filter } = req.query;
  res.render("recommendations/recommendations", {
    error: null,
    recommendations: [],
    filter: filter || "all",
  });
};





export const aiRecommendations = async (req, res, next) => {
  try {
    const userId = Number(req.body?.userId || req.query?.userId || req.user?.id || 1);
    const mealAnalysis = req.body?.meal || {};
    const data = await generateRecommendations({ userId, mealAnalysis });
    res.json({ data });
  } catch (err) {
    next(err);
  }
};