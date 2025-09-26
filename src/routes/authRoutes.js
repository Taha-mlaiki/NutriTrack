import { Router } from "express";
import {
  handleLogin,
  handleRegister,
  showLogin,
  showRegister,
} from "../controllers/authController.js";

const router = Router();

router.get("/login", showLogin);
router.post("/login", handleLogin);
router.get("/register", showRegister);
router.post("/register", handleRegister);

export default router;
