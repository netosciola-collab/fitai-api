import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { generateWorkoutPlan } from "../services/ai/planGenerator";

const router = Router();

// POST /api/v1/plans/generate — chamar o serviço de IA e salvar plano no banco
router.post("/generate", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const generatedPlan = await generateWorkoutPlan(user);

    // Criar plano no banco
    const plan = await prisma.workoutPlan.create({
      data: {
        userId: req.userId!,
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
      const workoutDay = await prisma.workoutDay.create({
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
        let exerciseRecord = await prisma.exercise.findFirst({
          where: { name: exercise.name },
        });

        if (!exerciseRecord) {
          exerciseRecord = await prisma.exercise.create({
            data: {
              name: exercise.name,
            },
          });
        }

        // Criar WorkoutExercise
        await prisma.workoutExercise.create({
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/plans/active — retornar plano ativo do usuário
router.get("/active", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const plan = await prisma.workoutPlan.findFirst({
      where: {
        userId: req.userId!,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/plans/:id — retornar plano específico
router.get("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const plan = await prisma.workoutPlan.findUnique({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
