import { Router } from "express";
import {
  showMeal,
  analyzeMeal,
  uploadMeal,
  getMealHistory,
  deleteMeal,
} from "../controllers/mealController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.get("/", showMeal);
router.post("/analyze", upload.single("image"), analyzeMeal);
router.post("/", upload.single("image"), uploadMeal);
router.get("/history", getMealHistory);
router.delete("/:id", deleteMeal);

export default router;
