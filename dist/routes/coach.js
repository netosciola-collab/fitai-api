"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
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
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const systemPrompt = `Você é o FitAI Coach, personal trainer digital de ${user.name}.
Perfil: objetivo=${user.goal}, nível=${user.experienceLevel}, dias=${user.availableDays}x/semana.
Tom: direto, motivador, técnico quando necessário. Respostas curtas (máx 3 parágrafos).
Nunca recomendar medicamentos ou dosagens de suplementos.`;
        const historyText = history && Array.isArray(history)
            ? history.map((m) => `${m.role}: ${m.content}`).join('\n')
            : '';
        const fullPrompt = `${systemPrompt}

${historyText ? `Histórico da conversa:\n${historyText}\n` : ''}Mensagem do usuário: ${message}`;
        const response = await axios_1.default.post(url, {
            contents: [{ parts: [{ text: fullPrompt }] }]
        });
        const reply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply });
    }
    catch (error) {
        console.error('Coach chat error:', error.response?.data || error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.default = router;
