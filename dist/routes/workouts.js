"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const validators_1 = require("../lib/validators");
const router = (0, express_1.Router)();
// POST /api/v1/workouts/sessions — iniciar sessão de treino
router.post("/sessions", auth_1.authMiddleware, async (req, res) => {
    try {
        const data = validators_1.WorkoutSessionSchema.parse(req.body);
        const session = await prisma_1.default.workoutSession.create({
            data: {
                userId: req.userId,
                workoutDayId: data.workoutDayId,
                durationMinutes: data.durationMinutes,
                notes: data.notes,
                completed: false,
            },
        });
        res.status(201).json(session);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// PUT /api/v1/workouts/sessions/:id — atualizar sessão (registrar séries)
router.put("/sessions/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        const data = validators_1.UpdateWorkoutSessionSchema.parse(req.body);
        const session = await prisma_1.default.workoutSession.update({
            where: { id: req.params.id },
            data,
        });
        res.json(session);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// POST /api/v1/workouts/sessions/:id/complete — finalizar sessão
router.post("/sessions/:id/complete", auth_1.authMiddleware, async (req, res) => {
    try {
        const data = validators_1.CompleteWorkoutSessionSchema.parse(req.body);
        const session = await prisma_1.default.workoutSession.update({
            where: { id: req.params.id },
            data: {
                completed: true,
                userRating: data.userRating,
                notes: data.notes,
            },
        });
        res.json(session);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// GET /api/v1/workouts/sessions — histórico de sessões
router.get("/sessions", auth_1.authMiddleware, async (req, res) => {
    try {
        const sessions = await prisma_1.default.workoutSession.findMany({
            where: { userId: req.userId },
            include: {
                workoutDay: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                            },
                        },
                    },
                },
            },
            orderBy: { date: "desc" },
            take: 50,
        });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/v1/workouts/sessions/:id — detalhes de uma sessão
router.get("/sessions/:id", auth_1.authMiddleware, async (req, res) => {
    try {
        const session = await prisma_1.default.workoutSession.findUnique({
            where: { id: req.params.id },
            include: {
                workoutDay: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                            },
                        },
                    },
                },
                exerciseLogs: {
                    include: {
                        exercise: true,
                        sets: true,
                    },
                },
            },
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        if (session.userId !== req.userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/v1/workouts/sessions/:sessionId/exercises/:exerciseId/sets — registrar série
router.post("/sessions/:sessionId/exercises/:exerciseId/sets", auth_1.authMiddleware, async (req, res) => {
    try {
        const data = validators_1.SetLogSchema.parse(req.body);
        // Buscar ou criar ExerciseLog
        let exerciseLog = await prisma_1.default.exerciseLog.findFirst({
            where: {
                sessionId: req.params.sessionId,
                exerciseId: req.params.exerciseId,
            },
        });
        if (!exerciseLog) {
            exerciseLog = await prisma_1.default.exerciseLog.create({
                data: {
                    sessionId: req.params.sessionId,
                    exerciseId: req.params.exerciseId,
                    order: 1,
                },
            });
        }
        // Criar SetLog
        const setLog = await prisma_1.default.setLog.create({
            data: {
                setNumber: data.setNumber || 1,
                reps: data.reps || 0,
                weight: data.weight || 0,
                rpe: data.rpe || null,
                isPR: data.isPR || false,
                exerciseLog: {
                    connect: { id: exerciseLog.id }
                }
            },
        });
        res.status(201).json(setLog);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
