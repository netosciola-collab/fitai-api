import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
        role: 'system',
        content: `Você é o FitAI Coach, personal trainer digital de ${user.name}.
Perfil: objetivo=${user.goal}, nível=${user.experienceLevel}, dias=${user.availableDays}x/semana.
Tom: direto, motivador, técnico quando necessário. Respostas curtas (máx 3 parágrafos).
Nunca recomendar medicamentos ou dosagens de suplementos.`,
      },
    ];

    // Adicionar histórico se existir
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }

    // Adicionar mensagem atual
    messages.push({ role: 'user', content: message });

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 500,
      messages,
    });

    const reply = completion.choices[0].message.content || '';

    res.json({ reply });
  } catch (error: any) {
    console.error('Coach chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
