import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Import routes
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import plansRouter from "./routes/plans";
import plansGenerateRouter from "./routes/plans-generate";
import checkinRouter from "./routes/checkin";
import workoutsRouter from "./routes/workouts";
import exercisesRouter from "./routes/exercises";
import coachRouter from "./routes/coach";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    "https://web-tau-steel-69.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/plans", plansRouter);
app.use("/api/v1/plans", plansGenerateRouter);
app.use("/api/v1/checkin", checkinRouter);
app.use("/api/v1/workouts", workoutsRouter);
app.use("/api/v1/exercises", exercisesRouter);
app.use("/api/v1/coach", coachRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
