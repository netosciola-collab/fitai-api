import openai from "../../lib/openai";
import { User } from "@prisma/client";

interface GeneratedPlan {
  planName: string;
  split: string;
  frequency: number;
  aiRationale: string;
  days: Array<{
    dayLabel: string;
    weekDay: number;
    muscleGroups: string[];
    estimatedTime: number;
    exercises: Array<{
      name: string;
      order: number;
      sets: number;
      repsMin: number;
      repsMax: number;
      restSeconds: number;
      technique: string | null;
      notes: string;
    }>;
  }>;
}

export async function generateWorkoutPlan(user: User): Promise<GeneratedPlan> {
  const prompt = `Você é um personal trainer especialista em prescrição de treino baseada em ciência.

Crie um plano de treino completo para este usuário:
- Nome: ${user.name}
- Objetivo: ${user.goal}
- Nível: ${user.experienceLevel}
- Dias disponíveis: ${user.availableDays}
- Duração por sessão: ${user.sessionDuration} minutos
- Local: ${user.gymType}
- Equipamentos: ${Array.isArray(user.equipment) ? user.equipment.join(", ") : typeof user.equipment === 'string' ? user.equipment : "Nenhum"}
- Lesões/limitações: ${user.injuryHistory || "Nenhuma"} / ${user.physicalLimits || "Nenhuma"}

Regras obrigatórias:
- 2 dias → Full Body
- 3 dias → Full Body ou PPL
- 4 dias → Upper/Lower
- 5-6 dias → PPL ou PPL x2
- Iniciante: 8-12 séries por músculo/semana
- Intermediário: 12-16 séries por músculo/semana
- Avançado: 16-22 séries por músculo/semana
- Nunca incluir exercício contraindicado para as lesões declaradas
- Priorizar compostos, depois auxiliares, depois isolados

Retorne APENAS um JSON válido neste formato:
{
  "planName": "PPL — Push/Pull/Legs",
  "split": "PPL",
  "frequency": 5,
  "aiRationale": "Explicação da escolha...",
  "days": [
    {
      "dayLabel": "Segunda — Empurrar (Peito/Ombro/Tríceps)",
      "weekDay": 1,
      "muscleGroups": ["peito", "ombro", "tríceps"],
      "estimatedTime": 60,
      "exercises": [
        {
          "name": "Supino Reto com Barra",
          "order": 1,
          "sets": 4,
          "repsMin": 8,
          "repsMax": 12,
          "restSeconds": 90,
          "technique": null,
          "notes": "Foco na descida controlada"
        }
      ]
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid JSON response from OpenAI");
  }

  const plan = JSON.parse(jsonMatch[0]) as GeneratedPlan;
  return plan;
}
