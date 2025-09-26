
import { Router } from "express";
import { showmealLogging } from "../controllers/mealLoggingController.js";

const router = Router ();

router.get("/", showmealLogging);

export default router;