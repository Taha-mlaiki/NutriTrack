
import { Router } from "express";
import { showRecommendations, aiRecommendations } from "../controllers/recommendationsController.js";

const router = Router ();

router.get("/", showRecommendations);
router.post("/ai", aiRecommendations);

export default router;