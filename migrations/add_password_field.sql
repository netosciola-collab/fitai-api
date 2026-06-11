-- AddColumn password to User
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191);

-- Modify equipment column from array to JSON
ALTER TABLE `User` MODIFY COLUMN `equipment` JSON;

-- Modify muscleGroups column from array to JSON
ALTER TABLE `WorkoutDay` MODIFY COLUMN `muscleGroups` JSON;

-- Modify positives column from array to JSON
ALTER TABLE `FormAnalysis` MODIFY COLUMN `positives` JSON;
