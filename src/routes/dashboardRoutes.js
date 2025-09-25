import { Router } from "express";
import { showDashboard, showHome } from "../controllers/DashboardController.js";

const router = Router();

router.get("/", showHome);
router.get("/dashboard", showDashboard);

export default router;
