
import { Router } from "express";
import { showReports } from "../controllers/reportsController.js";

const router = Router ();

router.get("/", showReports);

export default router;