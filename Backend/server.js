import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import { sanitizeMiddleware } from "./utils/sanitization.js";
import { requestLogger, logInfo, logError } from "./utils/logger.js";

import imagesRouter from "./routes/images.js";
import analysisRouter from "./routes/analysis.js";
import contactRouter from "./routes/contact.js";

dotenv.config();

// 🔥 CONNECT TO MONGODB AT STARTUP
connectDB();

const app = express();

// Rate limiting configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    message: "You have exceeded the rate limit. Please try again in 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limit for analysis (more resource-intensive)
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 analysis requests per hour
  message: {
    error: "Too many analysis requests",
    message: "You have exceeded the analysis rate limit. Please try again in 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(sanitizeMiddleware);

// Apply general rate limiting to all API routes
app.use("/api/", generalLimiter);

// ROUTES
app.use("/api/images", imagesRouter);
app.use("/api/analysis", analysisLimiter, analysisRouter);
app.use("/api/contact", contactRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`);
});
