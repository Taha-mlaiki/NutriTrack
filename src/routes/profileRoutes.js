
import { Router } from "express";
import { showProfile } from "../controllers/profileController.js";

const router = Router ();

router.get("/", showProfile);

export default router;