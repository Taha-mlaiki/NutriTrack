import { Router } from "express";
import { showMeal, analyzeMeal, uploadMeal } from "../controllers/mealController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.get("/", showMeal);
router.post("/analyze", upload.single("image"), analyzeMeal);
router.post("/upload", upload.single("image"), uploadMeal);


export default router;
