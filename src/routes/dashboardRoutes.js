import { Router } from "express";
import { showDashboard, showHome } from "../controllers/DashboardController.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../config/gemini.js";

const messages = [
  new SystemMessage("Translate the following from English into arabic"),
  new HumanMessage("this all I have for you!"),
];

const router = Router();

router.get("/", showHome);
router.get("/dashboard", showDashboard);
router.post("/chat", async (req, res) => {
  const response = await model.invoke(messages);

  if (!req.body || !req.body.message) {
    return res.status(400).json({ error: "Message is required" });
  }
  return res.json({ newMessage: response }); 
});

export default router;
