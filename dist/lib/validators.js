"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetLogSchema = exports.CompleteWorkoutSessionSchema = exports.UpdateWorkoutSessionSchema = exports.WorkoutSessionSchema = exports.CheckInSchema = exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
// User schemas
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    sex: zod_1.z.enum(["male", "female", "other"]),
    birthDate: zod_1.z.string().datetime(),
    weight: zod_1.z.number().positive(),
    height: zod_1.z.number().positive(),
    bodyFatPercent: zod_1.z.number().optional(),
    goal: zod_1.z.enum(["muscle_gain", "fat_loss", "strength", "endurance", "general_fitness"]),
    experienceLevel: zod_1.z.enum(["beginner", "intermediate", "advanced"]),
    availableDays: zod_1.z.number().int().min(2).max(7),
    sessionDuration: zod_1.z.number().int().min(30).max(180),
    gymType: zod_1.z.enum(["home", "commercial", "both"]),
    equipment: zod_1.z.array(zod_1.z.string()).optional(),
    injuryHistory: zod_1.z.string().optional(),
    physicalLimits: zod_1.z.string().optional(),
    preferredCardio: zod_1.z.string().optional(),
    stressLevel: zod_1.z.number().int().min(1).max(10),
    sleepQuality: zod_1.z.number().int().min(1).max(10),
    profession: zod_1.z.string().optional(),
    dailySteps: zod_1.z.number().int().optional(),
    medications: zod_1.z.string().optional(),
});
exports.UpdateUserSchema = exports.CreateUserSchema.partial();
// CheckIn schemas
exports.CheckInSchema = zod_1.z.object({
    sleepQuality: zod_1.z.number().int().min(1).max(10),
    energyLevel: zod_1.z.number().int().min(1).max(10),
    muscleSoreness: zod_1.z.number().int().min(1).max(10),
    stressLevel: zod_1.z.number().int().min(1).max(10),
    motivation: zod_1.z.number().int().min(1).max(10),
    availableTime: zod_1.z.number().int().min(0),
});
// Workout Session schemas
exports.WorkoutSessionSchema = zod_1.z.object({
    workoutDayId: zod_1.z.string(),
    durationMinutes: zod_1.z.number().int().positive(),
    notes: zod_1.z.string().optional(),
});
exports.UpdateWorkoutSessionSchema = zod_1.z.object({
    userRating: zod_1.z.number().int().min(1).max(10).optional(),
    notes: zod_1.z.string().optional(),
});
exports.CompleteWorkoutSessionSchema = zod_1.z.object({
    userRating: zod_1.z.number().int().min(1).max(10),
    notes: zod_1.z.string().optional(),
});
// Set Log schemas
exports.SetLogSchema = zod_1.z.object({
    setNumber: zod_1.z.number().int().positive(),
    reps: zod_1.z.number().int().positive(),
    weight: zod_1.z.number().positive(),
    rpe: zod_1.z.number().int().min(1).max(10).optional(),
    isPR: zod_1.z.boolean().optional(),
});
