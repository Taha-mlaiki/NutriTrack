import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dashRoutes from "./routes/dashboardRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import profileRoutes from "./routes/profileRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import recommendationsRoutes from "./routes/recommendationsRoutes.js";
import bodyParser from "body-parser";
import session from "express-session";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import cookieParser from "cookie-parser";
import { alreadyAuthMiddleware } from "./middlewares/alreadyAuthMiddleware.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// Static files
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret", // Add fallback for development
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/auth", alreadyAuthMiddleware, authRoutes);
app.use("/", authMiddleware, dashRoutes);
app.use("/profile", authMiddleware, profileRoutes);
app.use("/meals", authMiddleware, mealRoutes);
app.use("/reports", authMiddleware, reportsRoutes);
app.use("/recommendations", authMiddleware, recommendationsRoutes);
// app.use("/auth", authRoutes);
// app.use("/", dashRoutes);
// app.use("/profile", profileRoutes);
// app.use("/meals", mealRoutes);
// app.use("/reports", reportsRoutes);
// app.use("/recommendations", recommendationsRoutes);

app.use(errorHandler);

export default app;
