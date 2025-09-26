import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import dashRoutes from "./routes/dashboardRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import profileRoutes from "./routes/profileRoutes.js";
import mealLoggingRoutes from "./routes/mealLoggingRoutes.js";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes

app.use("/", dashRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/mealLogging", mealLoggingRoutes);

    


app.use(errorHandler);

export default app;
