"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const validators_1 = require("../lib/validators");
const checkInAdaptor_1 = require("../services/ai/checkInAdaptor");
const router = (0, express_1.Router)();
// POST /api/v1/checkin — processar check-in e retornar treino adaptado
router.post("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const data = validators_1.CheckInSchema.parse(req.body);
        // Criar check-in
        const { stressLevel, sleepQuality, energyLevel, muscleSoreness, motivation, availableTime } = data;
        const checkInResult = await (0, checkInAdaptor_1.processCheckIn)(data, {});
        const score = checkInResult.score || 0;
        const aiDecision = checkInResult.decision || "TREINO_NORMAL";
        const checkIn = await prisma_1.default.checkIn.create({
            data: {
                userId: req.userId,
                stressLevel,
                sleepQuality,
                energyLevel,
                muscleSoreness,
                motivation,
                availableTime,
                score,
                aiDecision,
            },
        });
        // Buscar plano ativo e dia de treino de hoje
        const today = new Date();
        const dayOfWeek = today.getDay();
        const plan = await prisma_1.default.workoutPlan.findFirst({
            where: {
                userId: req.userId,
                isActive: true,
            },
        });
        if (!plan) {
            return res.status(404).json({ error: "No active plan found" });
        }
        const workoutDay = await prisma_1.default.workoutDay.findFirst({
            where: {
                planId: plan.id,
                weekDay: dayOfWeek,
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                },
            },
        });
        if (!workoutDay) {
            return res.json({
                checkIn,
                message: "No workout scheduled for today",
            });
        }
        // Processar check-in e adaptar treino
        const adaptedWorkout = await (0, checkInAdaptor_1.processCheckIn)(data, workoutDay);
        res.json({
            checkIn,
            adaptedWorkout,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// GET /api/v1/checkin/today — verificar se já fez check-in hoje
router.get("/today", auth_1.authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const checkIn = await prisma_1.default.checkIn.findFirst({
            where: {
                userId: req.userId,
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        res.json({
            hasCheckIn: !!checkIn,
            checkIn: checkIn || null,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
