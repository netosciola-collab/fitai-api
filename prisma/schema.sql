-- Create tables for FitAI
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sex TEXT NOT NULL,
    "birthDate" TIMESTAMP NOT NULL,
    weight REAL NOT NULL,
    height REAL NOT NULL,
    "bodyFatPercent" REAL,
    goal TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "availableDays" INTEGER NOT NULL,
    "sessionDuration" INTEGER NOT NULL,
    "gymType" TEXT NOT NULL,
    equipment TEXT[],
    "injuryHistory" TEXT,
    "physicalLimits" TEXT,
    "preferredCardio" TEXT,
    "stressLevel" INTEGER NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    profession TEXT,
    "dailySteps" INTEGER,
    medications TEXT,
    plan TEXT DEFAULT 'free',
    "isDemo" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkoutPlan" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    split TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    phase TEXT DEFAULT 'accumulation',
    "phaseWeek" INTEGER DEFAULT 1,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP,
    "isActive" BOOLEAN DEFAULT true,
    "aiRationale" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkoutDay" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "planId" UUID NOT NULL REFERENCES "WorkoutPlan"(id) ON DELETE CASCADE,
    "dayLabel" TEXT NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "muscleGroups" TEXT[],
    "estimatedTime" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "Exercise" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    "muscleGroup" TEXT,
    equipment TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "WorkoutExercise" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "dayId" UUID NOT NULL REFERENCES "WorkoutDay"(id) ON DELETE CASCADE,
    "exerciseId" UUID NOT NULL REFERENCES "Exercise"(id),
    "order" INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    "repsMin" INTEGER NOT NULL,
    "repsMax" INTEGER NOT NULL,
    "suggestedWeight" REAL,
    "restSeconds" INTEGER NOT NULL,
    technique TEXT,
    notes TEXT,
    "isSuperset" BOOLEAN DEFAULT false,
    "supersetGroup" INTEGER
);

CREATE TABLE IF NOT EXISTS "CheckIn" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "sleepQuality" INTEGER NOT NULL,
    "energyLevel" INTEGER NOT NULL,
    "muscleSoreness" INTEGER NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    motivation INTEGER NOT NULL,
    "availableTime" INTEGER NOT NULL,
    score REAL NOT NULL,
    "aiDecision" TEXT NOT NULL,
    "aiRationale" TEXT,
    adjustments JSONB
);

CREATE TABLE IF NOT EXISTS "WorkoutSession" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "workoutDayId" UUID REFERENCES "WorkoutDay"(id),
    "checkInId" UUID,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "durationMinutes" INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    "totalVolume" REAL,
    "userRating" INTEGER,
    notes TEXT,
    "syncedFromLocal" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS "ExerciseLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL REFERENCES "WorkoutSession"(id) ON DELETE CASCADE,
    "exerciseId" UUID NOT NULL REFERENCES "Exercise"(id),
    "order" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "SetLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "exerciseLogId" UUID NOT NULL REFERENCES "ExerciseLog"(id) ON DELETE CASCADE,
    "setNumber" INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight REAL NOT NULL,
    rpe INTEGER,
    "isPR" BOOLEAN DEFAULT false,
    "completedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "BodyLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    weight REAL,
    "bodyFat" REAL,
    chest REAL,
    waist REAL,
    hips REAL,
    thigh REAL,
    arm REAL,
    "photoUrl" TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS "NutritionLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calories INTEGER,
    protein REAL,
    carbs REAL,
    fat REAL,
    water REAL,
    "mealDescription" TEXT,
    "photoUrl" TEXT,
    "aiAnalysis" TEXT
);

CREATE TABLE IF NOT EXISTS "FormAnalysis" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "exerciseId" UUID NOT NULL REFERENCES "Exercise"(id),
    "videoUrl" TEXT,
    "overallScore" INTEGER NOT NULL,
    positives TEXT[],
    corrections JSONB,
    "safetyAlert" TEXT,
    "nextFocus" TEXT,
    "analyzedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Achievement" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserAchievement" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "achievementId" UUID NOT NULL REFERENCES "Achievement"(id),
    "unlockedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "achievementId")
);

CREATE TABLE IF NOT EXISTS "Notification" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "WorkoutPlan_userId_idx" ON "WorkoutPlan"("userId");
CREATE INDEX IF NOT EXISTS "WorkoutDay_planId_idx" ON "WorkoutDay"("planId");
CREATE INDEX IF NOT EXISTS "WorkoutExercise_dayId_idx" ON "WorkoutExercise"("dayId");
CREATE INDEX IF NOT EXISTS "WorkoutExercise_exerciseId_idx" ON "WorkoutExercise"("exerciseId");
CREATE INDEX IF NOT EXISTS "CheckIn_userId_idx" ON "CheckIn"("userId");
CREATE INDEX IF NOT EXISTS "WorkoutSession_userId_idx" ON "WorkoutSession"("userId");
CREATE INDEX IF NOT EXISTS "ExerciseLog_sessionId_idx" ON "ExerciseLog"("sessionId");
CREATE INDEX IF NOT EXISTS "SetLog_exerciseLogId_idx" ON "SetLog"("exerciseLogId");
CREATE INDEX IF NOT EXISTS "BodyLog_userId_idx" ON "BodyLog"("userId");
CREATE INDEX IF NOT EXISTS "NutritionLog_userId_idx" ON "NutritionLog"("userId");
CREATE INDEX IF NOT EXISTS "FormAnalysis_userId_idx" ON "FormAnalysis"("userId");
CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
