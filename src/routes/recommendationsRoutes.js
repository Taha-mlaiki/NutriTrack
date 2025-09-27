
import { Router } from "express";
import { showRecommendations } from "../controllers/recommendationsController.js";

const router = Router ();

router.get("/", showRecommendations);

export default router;