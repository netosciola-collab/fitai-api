import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
  WorkoutSessionSchema,
  UpdateWorkoutSessionSchema,
  CompleteWorkoutSessionSchema,
  SetLogSchema,
} from "../lib/validators";

const router = Router();

// POST /api/v1/workouts/sessions — iniciar sessão de treino
router.post("/sessions", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = WorkoutSessionSchema.parse(req.body);

    const session = await prisma.workoutSession.create({
      data: {
        userId: req.userId!,
        workoutDayId: data.workoutDayId,
        durationMinutes: data.durationMinutes,
        notes: data.notes,
        completed: false,
      },
    });

    res.status(201).json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/v1/workouts/sessions/:id — atualizar sessão (registrar séries)
router.put("/sessions/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = UpdateWorkoutSessionSchema.parse(req.body);

    const session = await prisma.workoutSession.update({
      where: { id: req.params.id },
      data,
    });

    res.json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/v1/workouts/sessions/:id/complete — finalizar sessão
router.post("/sessions/:id/complete", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = CompleteWorkoutSessionSchema.parse(req.body);

    const session = await prisma.workoutSession.update({
      where: { id: req.params.id },
      data: {
        completed: true,
        userRating: data.userRating,
        notes: data.notes,
      },
    });

    res.json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/v1/workouts/sessions — histórico de sessões
router.get("/sessions", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId: req.userId! },
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/workouts/sessions/:id — detalhes de uma sessão
router.get("/sessions/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const session = await prisma.workoutSession.findUnique({
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
            setLogs: true,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/workouts/sessions/:sessionId/exercises/:exerciseId/sets — registrar série
router.post("/sessions/:sessionId/exercises/:exerciseId/sets", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = SetLogSchema.parse(req.body);

    // Buscar ou criar ExerciseLog
    let exerciseLog = await prisma.exerciseLog.findFirst({
      where: {
        sessionId: req.params.sessionId,
        exerciseId: req.params.exerciseId,
      },
    });

    if (!exerciseLog) {
      exerciseLog = await prisma.exerciseLog.create({
        data: {
          sessionId: req.params.sessionId,
          exerciseId: req.params.exerciseId,
          order: 1,
        },
      });
    }

    // Criar SetLog
    const setLog = await prisma.setLog.create({
      data: {
        exerciseLogId: exerciseLog.id,
        ...data,
      },
    });

    res.status(201).json(setLog);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
