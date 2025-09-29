
import { Router } from "express";
import { showMeal } from "../controllers/mealController.js";

const router = Router ();

router.get("/", showMeal);

export default router;