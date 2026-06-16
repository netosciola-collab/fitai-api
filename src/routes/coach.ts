import { Router, Request, Response } from 'express';
import axios from 'axios';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/v1/coach/chat — chat com IA
router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;

    // Buscar usuário para contexto
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`;

    const systemPrompt = `Você é o FitAI Coach, personal trainer digital de ${user.name}.
Perfil: objetivo=${user.goal}, nível=${user.experienceLevel}, dias=${user.availableDays}x/semana.
Tom: direto, motivador, técnico quando necessário. Respostas curtas (máx 3 parágrafos).
Nunca recomendar medicamentos ou dosagens de suplementos.`;

    const historyText = history && Array.isArray(history) 
      ? history.map((m: any) => `${m.role}: ${m.content}`).join('\n')
      : '';

    const fullPrompt = `${systemPrompt}

${historyText ? `Histórico da conversa:\n${historyText}\n` : ''}Mensagem do usuário: ${message}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: fullPrompt }] }]
    });

    const reply = response.data.candidates[0].content.parts[0].text;

    res.json({ reply });
  } catch (error: any) {
    console.error('Coach chat error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
