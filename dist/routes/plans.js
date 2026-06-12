"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const planGenerator_1 = require("../services/ai/planGenerator");
const router = (0, express_1.Router)();
// POST /api/v1/plans/generate — chamar o serviço de IA e salvar plano no banco
router.post("/generate", auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const generatedPlan = await (0, planGenerator_1.generateWorkoutPlan)(user);
        // Criar plano no banco
        const plan = await prisma_1.default.workoutPlan.create({
            data: {
                userId: req.userId,
                name: generatedPlan.planName,
                split: generatedPlan.split,
                frequency: generatedPlan.frequency,
                aiRationale: generatedPlan.aiRationale,
                isActive: true,
                startDate: new Date(),
            },
        });
        // Criar dias de treino
        for (const day of generatedPlan.days) {
            const workoutDay = await prisma_1.default.workoutDay.create({
                data: {
                    planId: plan.id,
                    dayLabel: day.dayLabel,
                    weekDay: day.weekDay,
                    muscleGroups: day.muscleGroups,
                    estimatedTime: day.estimatedTime,
                },
            });
            // Criar exercícios do dia
            for (const exercise of day.exercises) {
                // Buscar ou criar exercício
                let exerciseRecord = await prisma_1.default.exercise.findFirst({
                    where: { name: exercise.name },
                });
                if (!exerciseRecord) {
                    exerciseRecord = await prisma_1.default.exercise.create({
                        data: {
                            name: exercise.name,
                        },
                    });
                }
                // Criar WorkoutExercise
                await prisma_1.default.workoutExercise.create({
                    data: {
                        dayId: workoutDay.id,
                        exerciseId: exerciseRecord.id,
                        order: exercise.order,
                        sets: exercise.sets,
                        repsMin: exercise.repsMin,
                        repsMax: exercise.repsMax,
                        restSeconds: exercise.restSeconds,
                        technique: exercise.technique,
                        notes: exercise.notes,
                    },
                });
            }
        }
        res.status(201).json(plan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/v1/plans/active — retornar plano ativo do usuário
router.get("/active", auth_1.authMiddleware, async (req, res) => {
    try {
        const plan = await prisma_1.default.workoutPlan.findFirst({
            where: {
                userId: req.userId,
                isActive: true,
            },
            include: {
                workoutDays: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                            },
                        },
                    },
                },
            },
        });
        if (!plan) {
            return res.status(404).json({ error: "No active plan found" });
        }
        res.json(plan);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/v1/plans/:id — retornar plano específico
router.get("/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        const plan = await prisma_1.default.workoutPlan.findUnique({
            where: { id: req.params.id },
            include: {
                workoutDays: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                            },
                        },
                    },
                },
            },
        });
        if (!plan) {
            return res.status(404).json({ error: "Plan not found" });
        }
        if (plan.userId !== req.userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        res.json(plan);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
