"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("openai"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
// POST /api/v1/coach/chat — chat com IA
router.post('/chat', auth_1.authMiddleware, async (req, res) => {
    try {
        const { message, history } = req.body;
        // Buscar usuário para contexto
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Construir histórico de mensagens
        const messages = [
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
    }
    catch (error) {
        console.error('Coach chat error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
