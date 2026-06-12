import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { CreateUserSchema, UpdateUserSchema } from "../lib/validators";

const router = Router();

// POST /api/v1/users — criar perfil após onboarding
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = CreateUserSchema.parse(req.body);

    const user = await prisma.user.create({
      data: {
        id: req.userId!,
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
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "User already exists" });
    }
    res.status(400).json({ error: error.message });
  }
});

// GET /api/v1/users/me — retornar perfil do usuário autenticado
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/v1/users/me — atualizar perfil
router.put("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = UpdateUserSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
    });

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
