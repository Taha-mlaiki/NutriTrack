import { ChatGoogleGenerativeAI } from "@google/generative-ai";
export const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY
});
