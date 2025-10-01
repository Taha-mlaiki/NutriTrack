
import { Router } from "express";
import { showRecommendations, listRecommendations } from "../controllers/recommendationsController.js";

const router = Router ();

router.get("/", showRecommendations);
router.get("/api", listRecommendations);

export default router;