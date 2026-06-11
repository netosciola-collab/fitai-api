-- CreateTable WorkoutPlan
CREATE TABLE IF NOT EXISTS "WorkoutPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "split" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "phase" TEXT NOT NULL DEFAULT 'accumulation',
    "phaseWeek" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "aiRationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkoutPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable WorkoutDay
CREATE TABLE IF NOT EXISTS "WorkoutDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "dayLabel" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "muscleGroups" TEXT[],
    "estimatedTime" INTEGER NOT NULL,
    CONSTRAINT "WorkoutDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WorkoutPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable Exercise
CREATE TABLE IF NOT EXISTS "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "category" TEXT NOT NULL,
    "equipment" TEXT[],
    "difficulty" TEXT NOT NULL,
    "videoUrl" TEXT,
    "gifUrl" TEXT,
    "imageUrl" TEXT,
    "instructions" TEXT NOT NULL,
    "musclesPrimary" TEXT[],
    "musclesSecondary" TEXT[],
    "commonMistakes" TEXT,
    "alternatives" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable WorkoutExercise
CREATE TABLE IF NOT EXISTS "WorkoutExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "repsMin" INTEGER NOT NULL,
    "repsMax" INTEGER NOT NULL,
    "suggestedWeight" DOUBLE PRECISION,
    "restSeconds" INTEGER NOT NULL,
    "technique" TEXT,
    "notes" TEXT,
    "isSuperset" BOOLEAN NOT NULL DEFAULT false,
    "supersetGroup" INTEGER,
    CONSTRAINT "WorkoutExercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "WorkoutDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON UPDATE CASCADE
);

-- CreateTable CheckIn
CREATE TABLE IF NOT EXISTS "CheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sleepQuality" INTEGER NOT NULL,
    "energyLevel" INTEGER NOT NULL,
    "muscleSoreness" INTEGER NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    "motivation" INTEGER NOT NULL,
    "availableTime" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "aiDecision" TEXT NOT NULL,
    "aiRationale" TEXT,
    "adjustments" JSONB,
    CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable WorkoutSession
CREATE TABLE IF NOT EXISTS "WorkoutSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workoutDayId" TEXT,
    "checkInId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMinutes" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "totalVolume" DOUBLE PRECISION,
    "userRating" INTEGER,
    "notes" TEXT,
    "syncedFromLocal" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutSession_workoutDayId_fkey" FOREIGN KEY ("workoutDayId") REFERENCES "WorkoutDay" ("id") ON UPDATE CASCADE
);

-- CreateTable ExerciseLog
CREATE TABLE IF NOT EXISTS "ExerciseLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "ExerciseLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExerciseLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON UPDATE CASCADE
);

-- CreateTable SetLog
CREATE TABLE IF NOT EXISTS "SetLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exerciseLogId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "rpe" INTEGER,
    "isPR" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SetLog_exerciseLogId_fkey" FOREIGN KEY ("exerciseLogId") REFERENCES "ExerciseLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable BodyLog
CREATE TABLE IF NOT EXISTS "BodyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION,
    "bodyFat" DOUBLE PRECISION,
    "chest" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "thigh" DOUBLE PRECISION,
    "arm" DOUBLE PRECISION,
    "photoUrl" TEXT,
    "notes" TEXT,
    CONSTRAINT "BodyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable NutritionLog
CREATE TABLE IF NOT EXISTS "NutritionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calories" INTEGER,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "water" DOUBLE PRECISION,
    "mealDescription" TEXT,
    "photoUrl" TEXT,
    "aiAnalysis" TEXT,
    CONSTRAINT "NutritionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable FormAnalysis
CREATE TABLE IF NOT EXISTS "FormAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "videoUrl" TEXT,
    "overallScore" INTEGER NOT NULL,
    "positives" TEXT[],
    "corrections" JSONB NOT NULL,
    "safetyAlert" TEXT,
    "nextFocus" TEXT,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FormAnalysis_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON UPDATE CASCADE
);

-- CreateTable Achievement
CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL
);

-- CreateTable UserAchievement
CREATE TABLE IF NOT EXISTS "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON UPDATE CASCADE,
    UNIQUE("userId", "achievementId")
);

-- CreateTable Notification
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkoutPlan_userId_idx" ON "WorkoutPlan"("userId");
CREATE INDEX IF NOT EXISTS "WorkoutDay_planId_idx" ON "WorkoutDay"("planId");
CREATE INDEX IF NOT EXISTS "WorkoutExercise_dayId_idx" ON "WorkoutExercise"("dayId");
CREATE INDEX IF NOT EXISTS "WorkoutExercise_exerciseId_idx" ON "WorkoutExercise"("exerciseId");
CREATE INDEX IF NOT EXISTS "CheckIn_userId_idx" ON "CheckIn"("userId");
CREATE INDEX IF NOT EXISTS "WorkoutSession_userId_idx" ON "WorkoutSession"("userId");
CREATE INDEX IF NOT EXISTS "WorkoutSession_workoutDayId_idx" ON "WorkoutSession"("workoutDayId");
CREATE INDEX IF NOT EXISTS "ExerciseLog_sessionId_idx" ON "ExerciseLog"("sessionId");
CREATE INDEX IF NOT EXISTS "ExerciseLog_exerciseId_idx" ON "ExerciseLog"("exerciseId");
CREATE INDEX IF NOT EXISTS "SetLog_exerciseLogId_idx" ON "SetLog"("exerciseLogId");
CREATE INDEX IF NOT EXISTS "BodyLog_userId_idx" ON "BodyLog"("userId");
CREATE INDEX IF NOT EXISTS "NutritionLog_userId_idx" ON "NutritionLog"("userId");
CREATE INDEX IF NOT EXISTS "FormAnalysis_userId_idx" ON "FormAnalysis"("userId");
CREATE INDEX IF NOT EXISTS "FormAnalysis_exerciseId_idx" ON "FormAnalysis"("exerciseId");
CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");
CREATE INDEX IF NOT EXISTS "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
