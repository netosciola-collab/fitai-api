"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCheckIn = processCheckIn;
async function processCheckIn(checkInData, workoutDay) {
    // Calcular score ponderado
    const score = (checkInData.sleepQuality * 1.5 +
        checkInData.energyLevel * 2.0 +
        (6 - checkInData.muscleSoreness) * 1.0 +
        (6 - checkInData.stressLevel) * 1.0 +
        checkInData.motivation * 1.5) /
        7.0;
    let decision;
    let aiRationale;
    let adjustedExercises = [];
    // Decisão baseada no score
    if (score >= 4.0) {
        decision = "TREINO_NORMAL";
        aiRationale = "Você está em ótimas condições! Realize o treino completo como planejado.";
        adjustedExercises = workoutDay.exercises.map((ex) => ({
            id: ex.id,
            name: ex.exercise.name,
            sets: ex.sets,
            repsMin: ex.repsMin,
            repsMax: ex.repsMax,
            restSeconds: ex.restSeconds,
        }));
    }
    else if (score >= 3.0) {
        decision = "TREINO_MODERADO";
        aiRationale =
            "Você está bem, mas vamos reduzir um pouco o volume. Removeremos 1 exercício isolado e reduziremos 1 série nos compostos.";
        adjustedExercises = workoutDay.exercises
            .map((ex, idx) => {
            const isIsolated = !["supino", "agachamento", "rosca", "puxada"].some((c) => ex.exercise.name.toLowerCase().includes(c));
            if (isIsolated && idx === workoutDay.exercises.length - 1) {
                return null; // Remove último isolado
            }
            return {
                id: ex.id,
                name: ex.exercise.name,
                sets: !isIsolated ? Math.max(ex.sets - 1, 2) : ex.sets,
                repsMin: ex.repsMin,
                repsMax: ex.repsMax,
                restSeconds: ex.restSeconds,
                reason: !isIsolated ? "Reduzido 1 série" : undefined,
            };
        })
            .filter(Boolean);
    }
    else if (score >= 2.0) {
        decision = "TREINO_LEVE";
        aiRationale =
            "Você está cansado. Vamos fazer apenas os 3 exercícios principais com volume reduzido em 40%.";
        adjustedExercises = workoutDay.exercises
            .slice(0, 3)
            .map((ex) => ({
            id: ex.id,
            name: ex.exercise.name,
            sets: Math.ceil(ex.sets * 0.6),
            repsMin: ex.repsMin,
            repsMax: ex.repsMax,
            restSeconds: Math.ceil(ex.restSeconds * 0.8),
            reason: "Volume reduzido 40%",
        }));
    }
    else {
        decision = "RECUPERACAO_ATIVA";
        aiRationale =
            "Você precisa de recuperação. Recomendamos uma caminhada leve de 20-30 minutos ou alongamento.";
        adjustedExercises = [];
    }
    // Ajuste por tempo disponível
    if (checkInData.availableTime < 30) {
        adjustedExercises = adjustedExercises.slice(0, 3);
        aiRationale += " Tempo limitado: mantendo apenas os 3 compostos prioritários.";
    }
    else if (checkInData.availableTime <= 45) {
        adjustedExercises = adjustedExercises.filter((ex) => {
            const isIsolated = !["supino", "agachamento", "rosca", "puxada"].some((c) => ex.name.toLowerCase().includes(c));
            return !isIsolated;
        });
        aiRationale += " Tempo limitado: removidos exercícios isolados.";
    }
    return {
        score,
        decision,
        aiRationale,
        adjustedExercises,
    };
}
