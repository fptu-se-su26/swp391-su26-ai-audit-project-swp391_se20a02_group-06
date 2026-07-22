START TRANSACTION;
DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `migration_id` = '20260705092711_AddUserWaterReminderSettings') THEN

    ALTER TABLE `users` ADD `water_reminder_end_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `migration_id` = '20260705092711_AddUserWaterReminderSettings') THEN

    ALTER TABLE `users` ADD `water_reminder_start_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

DROP PROCEDURE IF EXISTS MigrationsScript;
DELIMITER //
CREATE PROCEDURE MigrationsScript()
BEGIN
    IF NOT EXISTS(SELECT 1 FROM `__EFMigrationsHistory` WHERE `migration_id` = '20260705092711_AddUserWaterReminderSettings') THEN

    INSERT INTO `__EFMigrationsHistory` (`migration_id`, `product_version`)
    VALUES ('20260705092711_AddUserWaterReminderSettings', '9.0.0');

    END IF;
END //
DELIMITER ;
CALL MigrationsScript();
DROP PROCEDURE MigrationsScript;

COMMIT;

