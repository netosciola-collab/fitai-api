"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// GET /api/v1/exercises — listar todos os exercícios
router.get("/", async (req, res) => {
    try {
        const exercises = await prisma_1.default.exercise.findMany({
            select: {
                id: true,
                name: true,
                muscleGroup: true,
                equipment: true,
                videoUrl: true,
            },
            orderBy: { name: "asc" },
        });
        res.json(exercises);
    }
    catch (error) {
        console.error("Get exercises error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});
// GET /api/v1/exercises/:id — obter exercício específico
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await prisma_1.default.exercise.findUnique({
            where: { id },
            include: {
                workoutExercises: {
                    select: {
                        sets: true,
                        repsMin: true,
                        repsMax: true,
                        restSeconds: true,
                    },
                },
            },
        });
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }
        res.json(exercise);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/v1/exercises/group/:muscleGroup — listar por grupo muscular
router.get("/group/:muscleGroup", async (req, res) => {
    try {
        const { muscleGroup } = req.params;
        const exercises = await prisma_1.default.exercise.findMany({
            where: { muscleGroup },
            select: {
                id: true,
                name: true,
                muscleGroup: true,
                equipment: true,
            },
            orderBy: { name: "asc" },
        });
        res.json(exercises);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
