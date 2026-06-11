import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

// GET /api/v1/exercises — listar todos os exercícios
router.get("/", async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        muscleGroup: true,
        equipment: true,
        videoUrl: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(exercises);
  } catch (error: any) {
    console.error("Get exercises error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// GET /api/v1/exercises/:id — obter exercício específico
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/exercises/group/:muscleGroup — listar por grupo muscular
router.get("/group/:muscleGroup", async (req: Request, res: Response) => {
  try {
    const { muscleGroup } = req.params;

    const exercises = await prisma.exercise.findMany({
      where: { muscleGroup },
      select: {
        id: true,
        name: true,
        description: true,
        muscleGroup: true,
        equipment: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(exercises);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
