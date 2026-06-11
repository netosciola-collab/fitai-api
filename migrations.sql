-- CreateTable User
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "bodyFatPercent" DOUBLE PRECISION,
    "goal" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "availableDays" INTEGER NOT NULL,
    "sessionDuration" INTEGER NOT NULL,
    "gymType" TEXT NOT NULL,
    "equipment" TEXT[],
    "injuryHistory" TEXT,
    "physicalLimits" TEXT,
    "preferredCardio" TEXT,
    "stressLevel" INTEGER NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    "profession" TEXT,
    "dailySteps" INTEGER,
    "medications" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable WorkoutPlan
CREATE TABLE "WorkoutPlan" (
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
CREATE TABLE "WorkoutDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "dayLabel" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "muscleGroups" TEXT[],
    "estimatedTime" INTEGER NOT NULL,
    CONSTRAINT "WorkoutDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WorkoutPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable Exercise
CREATE TABLE "Exercise" (
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
CREATE TABLE "WorkoutExercise" (
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
CREATE TABLE "CheckIn" (
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
CREATE TABLE "WorkoutSession" (
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
CREATE TABLE "ExerciseLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "ExerciseLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExerciseLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON UPDATE CASCADE
);

-- CreateTable SetLog
CREATE TABLE "SetLog" (
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
CREATE TABLE "BodyLog" (
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
CREATE TABLE "NutritionLog" (
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
CREATE TABLE "FormAnalysis" (
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
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL
);

-- CreateTable UserAchievement
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON UPDATE CASCADE,
    UNIQUE("userId", "achievementId")
);

-- CreateTable Notification
CREATE TABLE "Notification" (
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
CREATE INDEX "WorkoutPlan_userId_idx" ON "WorkoutPlan"("userId");
CREATE INDEX "WorkoutDay_planId_idx" ON "WorkoutDay"("planId");
CREATE INDEX "WorkoutExercise_dayId_idx" ON "WorkoutExercise"("dayId");
CREATE INDEX "WorkoutExercise_exerciseId_idx" ON "WorkoutExercise"("exerciseId");
CREATE INDEX "CheckIn_userId_idx" ON "CheckIn"("userId");
CREATE INDEX "WorkoutSession_userId_idx" ON "WorkoutSession"("userId");
CREATE INDEX "WorkoutSession_workoutDayId_idx" ON "WorkoutSession"("workoutDayId");
CREATE INDEX "ExerciseLog_sessionId_idx" ON "ExerciseLog"("sessionId");
CREATE INDEX "ExerciseLog_exerciseId_idx" ON "ExerciseLog"("exerciseId");
CREATE INDEX "SetLog_exerciseLogId_idx" ON "SetLog"("exerciseLogId");
CREATE INDEX "BodyLog_userId_idx" ON "BodyLog"("userId");
CREATE INDEX "NutritionLog_userId_idx" ON "NutritionLog"("userId");
CREATE INDEX "FormAnalysis_userId_idx" ON "FormAnalysis"("userId");
CREATE INDEX "FormAnalysis_exerciseId_idx" ON "FormAnalysis"("exerciseId");
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");
CREATE INDEX "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
