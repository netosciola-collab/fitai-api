"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/v1/plans/generate — gerar plano com IA
router.post("/generate", auth_1.authMiddleware, async (req, res) => {
    try {
        const { name, sex, birthDate, weight, height, goal, experienceLevel, availableDays, sessionDuration, gymType, injuries, physicalLimits, stressLevel, sleepQuality, preferredCardio, } = req.body;
        // Atualizar perfil do usuário
        const user = await prisma_1.default.user.update({
            where: { id: req.userId },
            data: {
                name,
                sex,
                birthDate: new Date(birthDate),
                weight,
                height,
                goal,
                experienceLevel,
                availableDays,
                sessionDuration,
                gymType,
                equipment: gymType === "gym" ? ["Dumbbells", "Barbell", "Machines"] : [],
                injuryHistory: injuries.join(", "),
                physicalLimits,
                stressLevel,
                sleepQuality,
                preferredCardio: preferredCardio.join(", "),
            },
        });
        // Criar plano de treino (simplificado para MVP)
        const plan = await prisma_1.default.workoutPlan.create({
            data: {
                userId: req.userId,
                name: `Plano ${goal} - ${availableDays}x/semana`,
                split: getSplitName(availableDays),
                frequency: availableDays,
                phase: "accumulation",
                phaseWeek: 1,
                startDate: new Date(),
                endDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 semanas
                isActive: true,
                aiRationale: `Plano personalizado baseado em: ${goal}, ${experienceLevel}, ${availableDays}x/semana, ${sessionDuration}min por sessão`,
            },
        });
        res.status(201).json({
            user,
            plan,
            message: "Plano gerado com sucesso!",
        });
    }
    catch (error) {
        console.error("Generate plan error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});
function getSplitName(days) {
    const splits = {
        2: "Upper/Lower",
        3: "PPL",
        4: "Upper/Lower 2x",
        5: "PPL+",
        6: "Full Body",
    };
    return splits[days] || "Custom";
}
exports.default = router;
