import { Router, Request, Response } from 'express';
import genAI from '../lib/openai';
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

    // Construir histórico de mensagens
    const messages: any[] = [
      {
        role: 'user',
        content: `Você é o FitAI Coach, personal trainer digital de ${user.name}.
Perfil: objetivo=${user.goal}, nível=${user.experienceLevel}, dias=${user.availableDays}x/semana.
Tom: direto, motivador, técnico quando necessário. Respostas curtas (máx 3 parágrafos).
Nunca recomendar medicamentos ou dosagens de suplementos.

Histórico da conversa:
${history && Array.isArray(history) ? history.map((m: any) => `${m.role}: ${m.content}`).join('\n') : ''}

Mensagem do usuário: ${message}`,
      },
    ];

    // Chamar Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(messages[0].content);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error: any) {
    console.error('Coach chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
