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
// POST /api/v1/users — criar perfil após onboarding
router.post("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const data = validators_1.CreateUserSchema.parse(req.body);
        const user = await prisma_1.default.user.create({
            data: {
                id: req.userId,
                email: data.email,
                name: data.name,
                sex: data.sex,
                birthDate: new Date(data.birthDate),
                weight: data.weight,
                height: data.height,
                bodyFatPercent: data.bodyFatPercent,
                goal: data.goal,
                experienceLevel: data.experienceLevel,
                availableDays: data.availableDays,
                sessionDuration: data.sessionDuration,
                gymType: data.gymType,
                equipment: data.equipment || [],
                injuryHistory: data.injuryHistory,
                physicalLimits: data.physicalLimits,
                preferredCardio: data.preferredCardio,
                stressLevel: data.stressLevel,
                sleepQuality: data.sleepQuality,
                profession: data.profession,
                dailySteps: data.dailySteps,
                medications: data.medications,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: "User already exists" });
        }
        res.status(400).json({ error: error.message });
    }
});
// GET /api/v1/users/me — retornar perfil do usuário autenticado
router.get("/me", auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PUT /api/v1/users/me — atualizar perfil
router.put("/me", auth_1.authMiddleware, async (req, res) => {
    try {
        const data = validators_1.UpdateUserSchema.parse(req.body);
        const user = await prisma_1.default.user.update({
            where: { id: req.userId },
            data: {
                ...data,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            },
        });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
