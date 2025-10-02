export const fakeRecommendations = [
  {
    id: 1,
    type: "medical",
    title: "Blood Sugar Management",
    subtitle: "Based on your diabetes profile",
    message:
      "Pair high‑carb meals with protein and fiber to slow glucose absorption.",
    meta: {
      mealTime: "Lunch (12:30 PM)",
      carbs: "65g (28% of daily limit)",
      suggestion: "Add protein source to next meal",
    },
    createdAt: "2 hours ago",
    status: "new",
  },
  {
    id: 2,
    type: "workout",
    title: "Afternoon Walk",
    subtitle: "Boost metabolism and improve glycemic control",
    message:
      "Take a 20‑minute brisk walk after lunch to improve digestion and reduce spikes.",
    meta: {
      duration: "20 min",
      intensity: "Brisk",
      suggestedTime: "1:00 PM",
    },
    createdAt: "3 hours ago",
    status: "new",
  },
  {
    id: 3,
    type: "nutrition",
    title: "Increase Fiber Intake",
    subtitle: "Improve digestion and reduce sugar spikes",
    message:
      "Add more vegetables, legumes, and whole grains to your meals to maintain stable glucose levels.",
    meta: {
      meal: "Lunch & Dinner",
      fiberGoal: "25g/day",
      suggestedFoods: "Beans, Lentils, Broccoli",
    },
    createdAt: "1 day ago",
    status: "new",
  },
  {
    id: 4,
    type: "hydration",
    title: "Stay Hydrated",
    subtitle: "Drink more water to improve overall health",
    message: "Log your water intake and aim for at least 2 liters daily.",
    meta: {
      consumed: "1.5L",
      goal: "2L",
      suggested: "500ml more today",
    },
    createdAt: "30 min ago",
    status: "new",
  },
  {
    id: 5,
    type: "weight",
    title: "Weight Management",
    subtitle: "Track calories and activity",
    message:
      "Aim to maintain your weight within a healthy range by tracking calories and activity.",
    meta: {
      currentWeight: "72kg",
      targetWeight: "70kg",
      suggestedAction: "Reduce 200 kcal/day",
    },
    createdAt: "yesterday",
    status: "new",
  },
];

export const showRecommendations = (req, res) => {
  const { filter } = req.query;
  const items = filter && filter !== "all"
    ? fakeRecommendations.filter((r) => r.type === filter)
    : fakeRecommendations;

  res.render("recommendations/recommendations", {
    error: null,
    recommendations: items,
    filter: filter || "all",
  });
};

export const listRecommendations = (req, res) => {
  res.json({ data: fakeRecommendations });
};

import { generateRecommendations } from "../services/recommendationsService.js";

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