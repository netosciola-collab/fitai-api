"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const plans_1 = __importDefault(require("./routes/plans"));
const plans_generate_1 = __importDefault(require("./routes/plans-generate"));
const checkin_1 = __importDefault(require("./routes/checkin"));
const workouts_1 = __importDefault(require("./routes/workouts"));
const exercises_1 = __importDefault(require("./routes/exercises"));
const coach_1 = __importDefault(require("./routes/coach"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "https://web-tau-steel-69.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
// Routes
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/users", users_1.default);
app.use("/api/v1/plans", plans_1.default);
app.use("/api/v1/plans", plans_generate_1.default);
app.use("/api/v1/checkin", checkin_1.default);
app.use("/api/v1/workouts", workouts_1.default);
app.use("/api/v1/exercises", exercises_1.default);
app.use("/api/v1/coach", coach_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
