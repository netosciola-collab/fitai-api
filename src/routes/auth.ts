import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/v1/auth/register — criar nova conta (demo/simplificado)
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Validação básica
    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Criar usuário (sem password para MVP - usar email como password temporário)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: email, // Usar email como password temporário
        sex: "not-specified",
        birthDate: new Date(),
        weight: 0,
        height: 0,
        goal: "general-fitness",
        experienceLevel: "beginner",
        availableDays: 3,
        sessionDuration: 60,
        gymType: "home",
        equipment: [],
        stressLevel: 5,
        sleepQuality: 5,
      },
    });

    // Gerar JWT
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// POST /api/v1/auth/login — fazer login (demo/simplificado - sem password)
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validação básica
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Gerar JWT
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// GET /api/v1/auth/me — obter usuário autenticado
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/auth/logout — fazer logout (apenas para limpar token no cliente)
router.post("/logout", authMiddleware, async (req: AuthRequest, res: Response) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
