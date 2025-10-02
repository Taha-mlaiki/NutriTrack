
import { Router } from "express";
import { showRecommendations, listRecommendations, aiRecommendations } from "../controllers/recommendationsController.js";

const router = Router ();

router.get("/", showRecommendations);
router.get("/api", listRecommendations);
router.post("/ai", aiRecommendations);

export default router;