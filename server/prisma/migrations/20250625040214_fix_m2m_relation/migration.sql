/*
  Warnings:

  - You are about to drop the column `subjectId` on the `groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `groups` DROP FOREIGN KEY `groups_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_teacherId_fkey`;

-- DropIndex
DROP INDEX `groups_subjectId_fkey` ON `groups`;

-- DropIndex
DROP INDEX `schedules_groupId_fkey` ON `schedules`;

-- DropIndex
DROP INDEX `schedules_subjectId_fkey` ON `schedules`;

-- DropIndex
DROP INDEX `schedules_teacherId_fkey` ON `schedules`;

-- AlterTable
ALTER TABLE `groups` DROP COLUMN `subjectId`;

-- AlterTable
ALTER TABLE `schedules` MODIFY `fecha` DATE NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `_GroupToSubject` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_GroupToSubject_AB_unique`(`A`, `B`),
    INDEX `_GroupToSubject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSubject` ADD CONSTRAINT `_GroupToSubject_A_fkey` FOREIGN KEY (`A`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSubject` ADD CONSTRAINT `_GroupToSubject_B_fkey` FOREIGN KEY (`B`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
