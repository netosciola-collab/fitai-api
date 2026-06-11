import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { CheckInSchema } from "../lib/validators";
import { processCheckIn } from "../services/ai/checkInAdaptor";

const router = Router();

// POST /api/v1/checkin — processar check-in e retornar treino adaptado
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = CheckInSchema.parse(req.body);

    // Criar check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        userId: req.userId!,
        ...data,
      },
    });

    // Buscar plano ativo e dia de treino de hoje
    const today = new Date();
    const dayOfWeek = today.getDay();

    const plan = await prisma.workout.findFirst({
      where: {
        userId: req.userId!,
        isActive: true,
      },
    });

    if (!plan) {
      return res.status(404).json({ error: "No active plan found" });
    }

    const workoutDay = await prisma.workoutDay.findFirst({
      where: {
        workoutId: plan.id,
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
    const adaptedWorkout = await processCheckIn(data, workoutDay as any);

    res.json({
      checkIn,
      adaptedWorkout,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/v1/checkin/today — verificar se já fez check-in hoje
router.get("/today", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        userId: req.userId!,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
