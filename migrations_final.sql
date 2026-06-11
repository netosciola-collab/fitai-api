-- CreateTable WorkoutDay (nova tabela)
CREATE TABLE IF NOT EXISTS "WorkoutDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "dayLabel" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "muscleGroups" TEXT[],
    "estimatedTime" INTEGER NOT NULL,
    CONSTRAINT "WorkoutDay_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable CheckIn (nova tabela)
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

-- CreateTable WorkoutSession (nova tabela)
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

-- CreateTable ExerciseLog (nova tabela)
CREATE TABLE IF NOT EXISTS "ExerciseLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "ExerciseLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExerciseLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON UPDATE CASCADE
);

-- CreateTable SetLog (nova tabela)
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

-- CreateTable BodyLog (nova tabela)
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

-- CreateTable FormAnalysis (nova tabela)
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

-- CreateTable Achievement (nova tabela)
CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL
);

-- CreateTable UserAchievement (nova tabela)
CREATE TABLE IF NOT EXISTS "UserAchievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement" ("id") ON UPDATE CASCADE,
    UNIQUE("userId", "achievementId")
);

-- CreateTable Notification (nova tabela)
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
CREATE INDEX IF NOT EXISTS "WorkoutDay_workoutId_idx" ON "WorkoutDay"("workoutId");
CREATE INDEX IF NOT EXISTS "CheckIn_userId_idx" ON "CheckIn"("userId");
CREATE INDEX IF NOT EXISTS "WorkoutSession_userId_idx" ON "WorkoutSession"("userId");
CREATE INDEX IF NOT EXISTS "WorkoutSession_workoutDayId_idx" ON "WorkoutSession"("workoutDayId");
CREATE INDEX IF NOT EXISTS "ExerciseLog_sessionId_idx" ON "ExerciseLog"("sessionId");
CREATE INDEX IF NOT EXISTS "ExerciseLog_exerciseId_idx" ON "ExerciseLog"("exerciseId");
CREATE INDEX IF NOT EXISTS "SetLog_exerciseLogId_idx" ON "SetLog"("exerciseLogId");
CREATE INDEX IF NOT EXISTS "BodyLog_userId_idx" ON "BodyLog"("userId");
CREATE INDEX IF NOT EXISTS "FormAnalysis_userId_idx" ON "FormAnalysis"("userId");
CREATE INDEX IF NOT EXISTS "FormAnalysis_exerciseId_idx" ON "FormAnalysis"("exerciseId");
CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");
CREATE INDEX IF NOT EXISTS "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
