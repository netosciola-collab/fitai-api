"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("../lib/openai"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
                role: 'user',
                content: `Você é o FitAI Coach, personal trainer digital de ${user.name}.
Perfil: objetivo=${user.goal}, nível=${user.experienceLevel}, dias=${user.availableDays}x/semana.
Tom: direto, motivador, técnico quando necessário. Respostas curtas (máx 3 parágrafos).
Nunca recomendar medicamentos ou dosagens de suplementos.

Histórico da conversa:
${history && Array.isArray(history) ? history.map((m) => `${m.role}: ${m.content}`).join('\n') : ''}

Mensagem do usuário: ${message}`,
            },
        ];
        // Chamar Gemini
        const model = openai_1.default.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(messages[0].content);
        const reply = result.response.text();
        res.json({ reply });
    }
    catch (error) {
        console.error('Coach chat error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
