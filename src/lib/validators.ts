import { z } from "zod";

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  sex: z.enum(["male", "female", "other"]),
  birthDate: z.string().datetime(),
  weight: z.number().positive(),
  height: z.number().positive(),
  bodyFatPercent: z.number().optional(),
  goal: z.enum(["muscle_gain", "fat_loss", "strength", "endurance", "general_fitness"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  availableDays: z.number().int().min(2).max(7),
  sessionDuration: z.number().int().min(30).max(180),
  gymType: z.enum(["home", "commercial", "both"]),
  equipment: z.array(z.string()).optional(),
  injuryHistory: z.string().optional(),
  physicalLimits: z.string().optional(),
  preferredCardio: z.string().optional(),
  stressLevel: z.number().int().min(1).max(10),
  sleepQuality: z.number().int().min(1).max(10),
  profession: z.string().optional(),
  dailySteps: z.number().int().optional(),
  medications: z.string().optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

// CheckIn schemas
export const CheckInSchema = z.object({
  sleepQuality: z.number().int().min(1).max(10),
  energyLevel: z.number().int().min(1).max(10),
  muscleSoreness: z.number().int().min(1).max(10),
  stressLevel: z.number().int().min(1).max(10),
  motivation: z.number().int().min(1).max(10),
  availableTime: z.number().int().min(0),
});

// Workout Session schemas
export const WorkoutSessionSchema = z.object({
  workoutDayId: z.string(),
  durationMinutes: z.number().int().positive(),
  notes: z.string().optional(),
});

export const UpdateWorkoutSessionSchema = z.object({
  userRating: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
});

export const CompleteWorkoutSessionSchema = z.object({
  userRating: z.number().int().min(1).max(10),
  notes: z.string().optional(),
});

// Set Log schemas
export const SetLogSchema = z.object({
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().positive(),
  rpe: z.number().int().min(1).max(10).optional(),
  isPR: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CheckInInput = z.infer<typeof CheckInSchema>;
export type WorkoutSessionInput = z.infer<typeof WorkoutSessionSchema>;
export type UpdateWorkoutSessionInput = z.infer<typeof UpdateWorkoutSessionSchema>;
export type CompleteWorkoutSessionInput = z.infer<typeof CompleteWorkoutSessionSchema>;
export type SetLogInput = z.infer<typeof SetLogSchema>;
