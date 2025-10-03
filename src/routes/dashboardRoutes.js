import { Router } from "express";
import { getDashboardStats, showDashboard, showHome } from "../controllers/DashboardController.js";

const router = Router();

router.get("/", showHome);
router.get("/dashboard", getDashboardStats);

export default router;
