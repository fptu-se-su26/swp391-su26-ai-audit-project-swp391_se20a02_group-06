START TRANSACTION;
ALTER TABLE `pt_upload_requests` DROP FOREIGN KEY `fk_pt_upload_requests_users_admin_id`;

ALTER TABLE `pt_upload_requests` MODIFY COLUMN `video_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

ALTER TABLE `pt_upload_requests` MODIFY COLUMN `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

ALTER TABLE `pt_upload_requests` ADD `deadline` datetime(6) NULL;

ALTER TABLE `pt_upload_requests` ADD `difficulty` int NULL;

ALTER TABLE `pt_upload_requests` ADD `duration` int NULL;

ALTER TABLE `pt_upload_requests` ADD `instructions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

ALTER TABLE `pt_upload_requests` ADD `muscle_group` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

ALTER TABLE `pt_upload_requests` ADD `priority` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

ALTER TABLE `pt_upload_requests` ADD `requested_by` int NULL;

CREATE INDEX `ix_pt_upload_requests_requested_by` ON `pt_upload_requests` (`requested_by`);

ALTER TABLE `pt_upload_requests` ADD CONSTRAINT `fk_pt_upload_requests_users_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

ALTER TABLE `pt_upload_requests` ADD CONSTRAINT `fk_pt_upload_requests_users_requested_by` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

INSERT INTO `__EFMigrationsHistory` (`migration_id`, `product_version`)
VALUES ('20260705082100_AddExerciseRequestFields', '9.0.0');

ALTER TABLE `users` ADD `water_reminder_end_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

ALTER TABLE `users` ADD `water_reminder_start_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

INSERT INTO `__EFMigrationsHistory` (`migration_id`, `product_version`)
VALUES ('20260705092711_AddUserWaterReminderSettings', '9.0.0');

ALTER TABLE `exercises` DROP FOREIGN KEY `fk_exercises_users_creator_id`;

ALTER TABLE `exercises` DROP INDEX `ix_exercises_creator_id`;

ALTER TABLE `exercises` DROP COLUMN `creator_id`;

ALTER TABLE `exercises` DROP COLUMN `muscle_group`;

CREATE INDEX `ix_exercises_created_by` ON `exercises` (`created_by`);

ALTER TABLE `exercises` ADD CONSTRAINT `fk_exercises_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

INSERT INTO `__EFMigrationsHistory` (`migration_id`, `product_version`)
VALUES ('20260709164343_FixCreatorId', '9.0.0');

ALTER TABLE `exercises` DROP FOREIGN KEY `fk_exercises_users_creator_id`;

ALTER TABLE `orders` DROP FOREIGN KEY `fk_orders_product_packages_package_id`;

ALTER TABLE `orders` DROP FOREIGN KEY `fk_orders_users_user_id`;

ALTER TABLE `pt_upload_requests` DROP FOREIGN KEY `fk_pt_upload_requests_users_admin_id`;

ALTER TABLE `pt_upload_requests` DROP FOREIGN KEY `fk_pt_upload_requests_users_requested_by`;

ALTER TABLE `pt_upload_requests` DROP INDEX `ix_pt_upload_requests_requested_by`;

ALTER TABLE `membership_subscriptions` DROP INDEX `ix_membership_subscriptions_order_id`;

ALTER TABLE `exercises` DROP INDEX `ix_exercises_creator_id`;

ALTER TABLE `orders` DROP COLUMN `expired_at`;

ALTER TABLE `exercises` DROP COLUMN `creator_id`;

ALTER TABLE `exercises` DROP COLUMN `muscle_group`;

ALTER TABLE `schedules` MODIFY COLUMN `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `pt_upload_requests` MODIFY COLUMN `difficulty` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

ALTER TABLE `pt_upload_requests` ADD `requested_by_user_id` int NULL;

ALTER TABLE `product_packages` MODIFY COLUMN `type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `orders` MODIFY COLUMN `user_id` int NOT NULL DEFAULT 0;

ALTER TABLE `orders` MODIFY COLUMN `payment_status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `orders` MODIFY COLUMN `package_id` int NOT NULL DEFAULT 0;

ALTER TABLE `orders` ADD `order_code` bigint NOT NULL DEFAULT 0;

ALTER TABLE `orders` ADD `user_id1` int NULL;

ALTER TABLE `exercises` MODIFY COLUMN `difficulty` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE `ai_recommendations` MODIFY COLUMN `type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

CREATE INDEX `ix_pt_upload_requests_requested_by_user_id` ON `pt_upload_requests` (`requested_by_user_id`);

CREATE INDEX `ix_orders_user_id1` ON `orders` (`user_id1`);

CREATE UNIQUE INDEX `ix_membership_subscriptions_order_id` ON `membership_subscriptions` (`order_id`);

CREATE INDEX `ix_exercises_created_by` ON `exercises` (`created_by`);

ALTER TABLE `exercises` ADD CONSTRAINT `fk_exercises_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_product_packages_package_id` FOREIGN KEY (`package_id`) REFERENCES `product_packages` (`id`) ON DELETE CASCADE;

ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_users_user_id1` FOREIGN KEY (`user_id1`) REFERENCES `users` (`id`);

ALTER TABLE `pt_upload_requests` ADD CONSTRAINT `fk_pt_upload_requests_users_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

ALTER TABLE `pt_upload_requests` ADD CONSTRAINT `fk_pt_upload_requests_users_requested_by_user_id` FOREIGN KEY (`requested_by_user_id`) REFERENCES `users` (`id`);

INSERT INTO `__EFMigrationsHistory` (`migration_id`, `product_version`)
VALUES ('20260715114331_AddPayOSOrderCode', '9.0.0');

ALTER TABLE `orders` DROP FOREIGN KEY `fk_orders_users_user_id1`;

ALTER TABLE `orders` DROP INDEX `ix_orders_user_id1`;

ALTER TABLE `orders` DROP COLUMN `user_id1`;

ALTER TABLE `users` ADD `is_email_verified` tinyint(1) NOT NULL DEFAULT FALSE;

INSERT INTO `__EFMigrationsHistory` (`migration_id`, `product_version`)
VALUES ('20260715124537_AddIsEmailVerified', '9.0.0');

COMMIT;
