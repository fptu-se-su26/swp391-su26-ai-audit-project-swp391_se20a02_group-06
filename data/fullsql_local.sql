  -- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
  --
  -- Host: 127.0.0.1    Database: fitnessproject
  -- ------------------------------------------------------
  -- Server version	8.0.46

  /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
  /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
  /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
  /*!50503 SET NAMES utf8 */;
  /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
  /*!40103 SET TIME_ZONE='+00:00' */;
  /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
  /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
  /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
  /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

  --
  -- Table structure for table `__efmigrationshistory`
  --

  DROP TABLE IF EXISTS `__efmigrationshistory`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `__efmigrationshistory` (
    `migration_id` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `product_version` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    PRIMARY KEY (`migration_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `__efmigrationshistory`
  --

  LOCK TABLES `__efmigrationshistory` WRITE;
  /*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
  INSERT INTO `__efmigrationshistory` VALUES ('20260704103147_InitialCreate','9.0.0'),('20260705082100_AddExerciseRequestFields','9.0.0'),('20260705092711_AddUserWaterReminderSettings','9.0.0'),('20260709164343_FixCreatorId','9.0.0'),('20260715114331_AddPayOSOrderCode','9.0.0'),('20260715124537_AddIsEmailVerified','9.0.0');
  /*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `ai_recommendations`
  --

  DROP TABLE IF EXISTS `ai_recommendations`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `ai_recommendations` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int DEFAULT NULL,
    `type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `user_request` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `ai_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` datetime(6) NOT NULL,
    `model_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`id`),
    KEY `ix_ai_recommendations_user_id` (`user_id`),
    CONSTRAINT `fk_ai_recommendations_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `ai_recommendations`
  --

  LOCK TABLES `ai_recommendations` WRITE;
  /*!40000 ALTER TABLE `ai_recommendations` DISABLE KEYS */;
  INSERT INTO `ai_recommendations` VALUES (1,3,'0','I want to build muscle and lose fat. I can train 4 days a week.','{\"plan_title\":\"4-Day Body Recomposition\",\"weeks\":8,\"days\":[{\"day\":\"Monday\",\"focus\":\"Upper Push\",\"exercises\":[\"Bench Press\",\"Overhead Press\",\"Incline Dumbbell Press\"]},{\"day\":\"Tuesday\",\"focus\":\"Lower Body\",\"exercises\":[\"Barbell Squat\",\"Romanian Deadlift\",\"Dumbbell Lunges\"]},{\"day\":\"Thursday\",\"focus\":\"Upper Pull\",\"exercises\":[\"Pull-Up\",\"Bicep Curl\",\"Cable Tricep Pushdown\"]},{\"day\":\"Friday\",\"focus\":\"Cardio & Core\",\"exercises\":[\"HIIT Treadmill Sprint\",\"Battle Ropes\",\"Plank\"]}]}','2025-01-06 10:00:00.000000',NULL),(2,3,'0','I want a high-protein meal plan to support fat loss. Around 1900 kcal per day.','{\"diet_title\":\"High-Protein Fat Loss Plan\",\"daily_calories\":1900,\"protein_target_g\":175,\"meals\":[{\"name\":\"Breakfast\",\"foods\":[{\"food_name\":\"Oatmeal\",\"amount\":\"100g\"},{\"food_name\":\"Whole Eggs\",\"amount\":\"3 pieces\"},{\"food_name\":\"Banana\",\"amount\":\"1 piece\"}],\"calories\":500},{\"name\":\"Lunch\",\"foods\":[{\"food_name\":\"Grilled Chicken Breast\",\"amount\":\"200g\"},{\"food_name\":\"Brown Rice\",\"amount\":\"150g\"},{\"food_name\":\"Steamed Broccoli\",\"amount\":\"100g\"}],\"calories\":580},{\"name\":\"Post-Workout Snack\",\"foods\":[{\"food_name\":\"Whey Protein\",\"amount\":\"1 scoop\"},{\"food_name\":\"Banana\",\"amount\":\"1 piece\"}],\"calories\":225},{\"name\":\"Dinner\",\"foods\":[{\"food_name\":\"Baked Salmon\",\"amount\":\"150g\"},{\"food_name\":\"Sweet Potato\",\"amount\":\"100g\"},{\"food_name\":\"Raw Spinach\",\"amount\":\"100g\"}],\"calories\":420},{\"name\":\"Evening Snack\",\"foods\":[{\"food_name\":\"Greek Yogurt\",\"amount\":\"150g\"},{\"food_name\":\"Almonds\",\"amount\":\"30g\"}],\"calories\":175}]}','2026-03-11 09:00:00.000000',NULL),(3,3,'0','I feel ready to level up. Can I get a 5-day intermediate hypertrophy program?','{\"plan_title\":\"5-Day Hypertrophy Split\",\"weeks\":10,\"days\":[{\"day\":\"Monday\",\"focus\":\"Chest & Triceps\",\"exercises\":[\"Barbell Bench Press\",\"Incline Dumbbell Press\",\"Cable Tricep Pushdown\"]},{\"day\":\"Tuesday\",\"focus\":\"Back & Biceps\",\"exercises\":[\"Deadlift\",\"Pull-Up\",\"Dumbbell Bicep Curl\"]},{\"day\":\"Wednesday\",\"focus\":\"Legs\",\"exercises\":[\"Barbell Back Squat\",\"Romanian Deadlift\",\"Dumbbell Lunges\"]},{\"day\":\"Thursday\",\"focus\":\"Shoulders\",\"exercises\":[\"Overhead Press\",\"Hanging Leg Raise\"]},{\"day\":\"Friday\",\"focus\":\"Full Body HIIT\",\"exercises\":[\"HIIT Treadmill Sprint\",\"Battle Ropes\",\"Plank\"]}]}','2025-06-02 11:30:00.000000',NULL);
  /*!40000 ALTER TABLE `ai_recommendations` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `body_metrics`
  --

  DROP TABLE IF EXISTS `body_metrics`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `body_metrics` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `height` decimal(65,30) DEFAULT NULL,
    `weight` decimal(65,30) NOT NULL,
    `body_fat_percentage` decimal(65,30) DEFAULT NULL,
    `muscle_mass` decimal(65,30) DEFAULT NULL,
    `bmi` decimal(65,30) DEFAULT NULL,
    `recorded_at` datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_body_metrics_user_id` (`user_id`),
    CONSTRAINT `fk_body_metrics_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `body_metrics`
  --

  LOCK TABLES `body_metrics` WRITE;
  /*!40000 ALTER TABLE `body_metrics` DISABLE KEYS */;
  INSERT INTO `body_metrics` VALUES (1,3,172.000000000000000000000000000000,80.000000000000000000000000000000,22.000000000000000000000000000000,40.000000000000000000000000000000,27.040000000000000000000000000000,'2025-01-05 09:30:00.000000'),(2,3,172.000000000000000000000000000000,78.500000000000000000000000000000,20.500000000000000000000000000000,41.000000000000000000000000000000,26.540000000000000000000000000000,'2025-03-10 10:00:00.000000'),(3,3,172.000000000000000000000000000000,77.000000000000000000000000000000,19.000000000000000000000000000000,42.000000000000000000000000000000,26.030000000000000000000000000000,'2025-06-01 10:00:00.000000'),(4,5,170.000000000000000000000000000000,65.000000000000000000000000000000,NULL,NULL,22.491349480968860000000000000000,'2026-07-16 03:39:15.616542'),(5,6,170.000000000000000000000000000000,65.000000000000000000000000000000,NULL,NULL,22.491349480968860000000000000000,'2026-07-16 08:39:30.160129'),(6,1,170.000000000000000000000000000000,65.000000000000000000000000000000,NULL,NULL,22.491349480968860000000000000000,'2026-07-17 03:13:34.242418'),(7,2,170.000000000000000000000000000000,20.000000000000000000000000000000,NULL,NULL,6.920415224913495000000000000000,'2026-07-17 03:49:50.921485'),(8,7,17.000000000000000000000000000000,66.000000000000000000000000000000,NULL,NULL,2283.737024221453000000000000000000,'2026-07-17 04:52:43.927124'),(9,2,172.000000000000000000000000000000,65.000000000000000000000000000000,NULL,NULL,21.971335857220122000000000000000,'2026-07-17 08:37:01.692216');
  /*!40000 ALTER TABLE `body_metrics` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `daily_nutrition_logs`
  --

  DROP TABLE IF EXISTS `daily_nutrition_logs`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `daily_nutrition_logs` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `log_date` datetime(6) NOT NULL,
    `calories_target` int NOT NULL,
    `protein_target_grams` decimal(65,30) NOT NULL,
    `carbs_target_grams` decimal(65,30) NOT NULL,
    `fat_target_grams` decimal(65,30) NOT NULL,
    `water_target_glasses` int NOT NULL,
    `calories_consumed` int NOT NULL,
    `protein_consumed_grams` decimal(65,30) NOT NULL,
    `carbs_consumed_grams` decimal(65,30) NOT NULL,
    `fat_consumed_grams` decimal(65,30) NOT NULL,
    `water_consumed_glasses` int NOT NULL,
    `calories_burned` decimal(65,30) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `IX_DailyNutritionLog_UserId_LogDate` (`user_id`,`log_date`),
    CONSTRAINT `fk_daily_nutrition_logs_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `daily_nutrition_logs`
  --

  LOCK TABLES `daily_nutrition_logs` WRITE;
  /*!40000 ALTER TABLE `daily_nutrition_logs` DISABLE KEYS */;
  INSERT INTO `daily_nutrition_logs` VALUES (6,5,'2026-07-14 00:00:00.000000',2153,246.000000000000000000000000000000,157.605468750000000000000000000000,59.793402777777777777777777778000,17,0,0.000000000000000000000000000000,0.000000000000000000000000000000,0.000000000000000000000000000000,8,1200.000000000000000000000000000000),(7,2,'2026-07-14 00:00:00.000000',2000,150.000000000000000000000000000000,200.000000000000000000000000000000,65.000000000000000000000000000000,8,0,0.000000000000000000000000000000,0.000000000000000000000000000000,0.000000000000000000000000000000,0,0.000000000000000000000000000000),(8,5,'2026-07-15 00:00:00.000000',2153,246.000000000000000000000000000000,157.605468750000000000000000000000,59.793402777777777777777777778000,17,0,0.000000000000000000000000000000,0.000000000000000000000000000000,0.000000000000000000000000000000,1,600.000000000000000000000000000000),(9,5,'2026-07-16 00:00:00.000000',2468,130.000000000000000000000000000000,332.820312500000000000000000000000,68.565972222222222222222222222000,9,0,0.000000000000000000000000000000,0.000000000000000000000000000000,0.000000000000000000000000000000,1,2100.000000000000000000000000000000),(10,2,'2026-07-17 00:00:00.000000',2488,130.000000000000000000000000000000,336.453125000000000000000000000000,69.104166666666666666666666667000,9,0,0.000000000000000000000000000000,0.000000000000000000000000000000,0.000000000000000000000000000000,1,0.000000000000000000000000000000),(11,5,'2026-07-17 00:00:00.000000',2468,130.000000000000000000000000000000,332.820312500000000000000000000000,68.565972222222222222222222222000,9,0,0.000000000000000000000000000000,0.000000000000000000000000000000,0.000000000000000000000000000000,2,0.000000000000000000000000000000);
  /*!40000 ALTER TABLE `daily_nutrition_logs` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `emailotp`
  --

  DROP TABLE IF EXISTS `emailotp`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `emailotp` (
    `Id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `OTPCode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `Purpose` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `ExpiredAt` datetime NOT NULL,
    `IsUsed` bit(1) NOT NULL DEFAULT b'0',
    `AttemptCount` int NOT NULL DEFAULT '0',
    `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_EmailOTP_Email` (`Email`),
    KEY `IX_EmailOTP_Purpose` (`Purpose`),
    KEY `IX_EmailOTP_ExpiredAt` (`ExpiredAt`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `emailotp`
  --

  LOCK TABLES `emailotp` WRITE;
  /*!40000 ALTER TABLE `emailotp` DISABLE KEYS */;
  /*!40000 ALTER TABLE `emailotp` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `exercises`
  --

  DROP TABLE IF EXISTS `exercises`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `exercises` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `video_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `difficulty` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `duration` int DEFAULT NULL,
    `created_by` int DEFAULT NULL,
    `muscle_group_id` int DEFAULT NULL,
    `created_at` datetime(6) NOT NULL,
    `package_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_exercises_muscle_group_id` (`muscle_group_id`),
    KEY `ix_exercises_created_by` (`created_by`),
    KEY `fk_exercises_product_packages_package_id` (`package_id`),
    CONSTRAINT `fk_exercises_muscle_groups_muscle_group_id` FOREIGN KEY (`muscle_group_id`) REFERENCES `muscle_groups` (`id`),
    CONSTRAINT `fk_exercises_product_packages_package_id` FOREIGN KEY (`package_id`) REFERENCES `product_packages` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_exercises_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `exercises`
  --

  LOCK TABLES `exercises` WRITE;
  /*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
  INSERT INTO `exercises` VALUES (1,'Warmup Exercise 1','Gentle marching in place to warm up the body.','https://res.cloudinary.com/bucd22r4/video/upload/v1783519878/8017173331047_zjmdja.mp4','0',5,2,7,'2026-07-16 10:32:44.375780',NULL),(2,'Warmup Exercise 2','Raise arms overhead while alternating side steps in rhythm.','https://res.cloudinary.com/bucd22r4/video/upload/v1783520882/8017173395908_lzpx23.mp4','0',5,2,7,'2026-07-16 10:32:44.375780',NULL),(3,'Warmup Exercise 3','Lower hips while stepping one leg backward, alternating sides.','https://res.cloudinary.com/bucd22r4/video/upload/v1783521212/8017173637193_ybxuoq.mp4','0',5,2,3,'2026-07-16 10:32:44.375780',NULL),(4,'Warmup Exercise 4','Simple low intensity exercise to prepare for a workout.','https://res.cloudinary.com/bucd22r4/video/upload/v1783523875/8017173747145_aqfvrr.mp4','0',5,2,7,'2026-07-16 10:32:44.375780',NULL),(5,'Warmup Exercise 5','Easy movement designed to loosen up tight muscles safely.','https://res.cloudinary.com/bucd22r4/video/upload/v1783524064/8017174522387_i6last.mp4','0',5,2,7,'2026-07-16 10:32:44.375780',NULL),(6,'Warmup Exercise 6','Low-impact movement to elevate core temperature and heart rate.','https://res.cloudinary.com/bucd22r4/video/upload/v1783524815/8017174582040_veciou.mp4','0',5,2,7,'2026-07-16 10:32:44.375780',NULL),(7,'Warmup Exercise 7','Basic exercise to activate target muscles before your workout.','https://res.cloudinary.com/bucd22r4/video/upload/v1783524892/8017174806631_ygekab.mp4','0',5,2,7,'2026-07-16 10:32:44.375780',NULL),(8,'Mountain Climbers','Drive knees toward the chest alternating from a plank.','https://res.cloudinary.com/bucd22r4/video/upload/v1783527937/8018825646358_nelbm3.mp4','1',10,2,6,'2026-07-16 10:32:44.375780',5),(9,'Plank Crunch','Bring opposite knee and elbow inward while holding plank.','https://res.cloudinary.com/bucd22r4/video/upload/v1783527957/8018825658035_hlqygj.mp4','2',15,2,6,'2026-07-16 10:32:44.375780',5),(10,'Plank Hops','Hop both feet forward and backward from a plank.','https://res.cloudinary.com/bucd22r4/video/upload/v1783527962/8018825676592_lqzlgr.mp4','1',10,2,6,'2026-07-16 10:32:44.375780',5),(11,'3/4 Sit-Up','Lie flat on your back with your knees bent and feet flat on the ground. Place your hands behind your head with your elbows pointing outwards. Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle. Pause for a moment at the top, then slowly lower back down.','https://res.cloudinary.com/bucd22r4/image/upload/v1784125265/fitness-training/exercises/j2c6n0smecvzapwclvio.gif','0',15,7,6,'2026-07-16 10:32:44.380476',1),(12,'Air Bike','Lie flat on your back with your hands placed behind your head. Lift your legs off the ground and bend your knees at a 90-degree angle. Bring your right elbow towards your left knee while simultaneously straightening your right leg. Return to the starting position and repeat on the opposite side. Continue alternating sides in a pedaling motion.','https://res.cloudinary.com/bucd22r4/image/upload/v1784125337/fitness-training/exercises/b7cmgdnuzp7x5kqc21p9.gif','1',10,7,6,'2026-07-16 10:32:44.380476',1),(13,'All Fours Quad Stretch','Start on all fours with your hands directly under your shoulders and your knees directly under your hips. Extend one leg straight back, keeping your knee bent and your foot flexed. Slowly lower your hips towards the ground, feeling a stretch in your quads. Hold for 20-30 seconds. Switch legs and repeat.','https://res.cloudinary.com/bucd22r4/image/upload/v1784125409/fitness-training/exercises/wywsquxqpkfmqqueb3ow.gif','0',10,7,3,'2026-07-16 10:32:44.380476',NULL),(16,'Astride Jumps','Stand with your feet shoulder-width apart. Bend your knees and lower your body into a squat position. Jump explosively upwards, extending your legs and arms. While in the air, spread your legs apart and bring your arms out to the sides. Land softly with your feet shoulder-width apart, bending your knees to absorb the impact.','https://res.cloudinary.com/bucd22r4/image/upload/v1784125664/fitness-training/exercises/etgupapgmftvgmlzd0qc.gif','1',10,7,3,'2026-07-16 10:32:44.380476',NULL),(17,'Basic Toe Touch','Stand with your feet shoulder-width apart and your arms by your sides. Bend forward at the waist, keeping your back straight and your knees slightly bent. Reach down towards your toes with your hands, keeping your legs as straight as possible. Pause for a moment at the bottom, then slowly return to the starting position.','https://res.cloudinary.com/bucd22r4/image/upload/v1784125699/fitness-training/exercises/kqpxuiiqamunag8taaog.gif','0',10,7,3,'2026-07-16 10:32:44.380476',NULL),(18,'Bear Crawl','Start on all fours with your hands directly under your shoulders and your knees directly under your hips. Lift your knees slightly off the ground, keeping your back flat and your core engaged. Move your right hand and left foot forward simultaneously, followed by your left hand and right foot. Continue crawling forward, alternating movements.','https://res.cloudinary.com/bucd22r4/image/upload/v1784125740/fitness-training/exercises/jetd1uh9vra2kcneelzp.gif','1',10,7,6,'2026-07-16 10:32:44.380476',NULL),(19,'Burpee','Start in a standing position. Lower your body into a squat and place your hands on the floor. Kick your feet back into a push-up position. Perform a push-up. Jump your feet back into the squat position. Jump up explosively, reaching your arms overhead. Land softly and immediately lower back into a squat to begin the next repetition.','https://res.cloudinary.com/bucd22r4/image/upload/v1784125808/fitness-training/exercises/fcocpmzvnnykh0eibupo.gif','2',10,7,7,'2026-07-16 10:32:44.380476',NULL),(20,'Close-Grip Push-Up','Start in a high plank position with your hands placed close together, directly under your shoulders. Engage your core and lower your body towards the ground, keeping your elbows close to your sides. Push through your palms to extend your arms and return to the starting position.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126060/fitness-training/exercises/amropb8hmj29i0yowxfu.gif','1',10,7,1,'2026-07-16 10:32:44.380476',NULL),(21,'Neck Side Stretch','Stand or sit up straight with your shoulders relaxed. Tilt your head to one side, bringing your ear towards your shoulder. Hold the stretch for 15-30 seconds. Repeat on the other side. Perform 2-4 sets on each side.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126115/fitness-training/exercises/gdbhxrdizqwfqwyctsof.gif','0',10,7,2,'2026-07-16 10:32:44.380476',NULL),(22,'Inchworm','Start in a standing position with your feet hip-width apart. Bend forward and place your hands on the ground. Walk your hands forward until you are in a high plank position. Pause, then walk your hands back towards your feet, keeping your legs as straight as possible. Stand back up to the starting position.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126178/fitness-training/exercises/ft4m3t1cubjehbhcif4g.gif','1',10,7,4,'2026-07-16 10:32:44.380476',NULL),(23,'Chest Tap Push-Up','Start in a high plank position. Lower your body towards the ground by bending your elbows. As you lower yourself, tap your chest with your right hand. Push yourself back up. Repeat, tapping your chest with your left hand. Continue alternating sides for the desired number of repetitions.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126261/fitness-training/exercises/jt4olsus94eifdapndmg.gif','1',10,7,5,'2026-07-16 10:32:44.380476',NULL),(24,'Diamond Push-Up','Start in a high plank position with your hands close together, forming a diamond shape with your thumbs and index fingers. Keep your body in a straight line. Lower your chest towards the diamond shape, keeping your elbows close to your body. Pause at the bottom, then push back up to the starting position.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126544/fitness-training/exercises/psq6kkytqqaqu6fvjpof.gif','1',10,7,1,'2026-07-16 10:32:44.380476',NULL),(25,'Rear Deltoid Stretch','Stand tall with your feet shoulder-width apart. Extend your right arm across your chest, placing your left hand on your right elbow. Gently pull your right arm towards your left shoulder, feeling a stretch in your right shoulder. Hold for 15-30 seconds, then release. Repeat on the other side.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126590/fitness-training/exercises/pcnahf5p7iphwoqs4hxz.gif','0',10,7,2,'2026-07-16 10:32:44.380476',NULL),(26,'Side Push Neck Stretch','Stand or sit up straight with your shoulders relaxed. Tilt your head to the right, bringing your right ear towards your right shoulder. Place your right hand on the left side of your head and gently apply pressure to increase the stretch. Hold for 15-30 seconds. Repeat on the other side 2-3 times.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126626/fitness-training/exercises/tve5tlyvhue2bafdchoj.gif','0',10,7,2,'2026-07-16 10:32:44.380476',NULL),(27,'Pelvic Tilt','Lie flat on your back with your knees bent and feet flat on the ground. Engage your abs and tilt your pelvis upward, pressing your lower back into the ground. Hold this position for a few seconds, focusing on contracting your abs. Release the tilt and return to the starting position. Repeat for the desired number of repetitions.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126674/fitness-training/exercises/rdla9v1fwn6v5a8wn70t.gif','0',10,7,2,'2026-07-16 10:32:44.380476',NULL),(28,'Scapula Dips','Start by standing with your feet shoulder-width apart and your arms extended in front of you. Bend your knees slightly and hinge forward at the hips. Lower your body by bending your elbows and retracting your shoulder blades, as if squeezing a pencil between them. Pause at the bottom, then push back up to the starting position.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126711/fitness-training/exercises/qe8ngpzuyyj0luva1nul.gif','1',10,7,2,'2026-07-16 10:32:44.380476',NULL),(29,'Butterfly Yoga Pose','Sit on the floor with your legs extended in front of you. Bend your knees and bring the soles of your feet together, allowing your knees to fall out to the sides. Hold onto your ankles or feet with your hands. Sit up tall and lengthen your spine. Gently press your knees down towards the floor, feeling a stretch in your inner thighs. Hold for a few breaths.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126778/fitness-training/exercises/atvirwjnjp52kkgkrrrz.gif','0',10,2,3,'2026-07-16 10:32:44.380476',NULL),(30,'Shoulder Tap','Start in a high plank position with your hands directly under your shoulders and your body in a straight line. Engage your core and lift your right hand off the ground, reaching across to tap your left shoulder. Place it back and repeat with your left hand tapping your right shoulder. Continue alternating while keeping your hips and torso stable.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126822/fitness-training/exercises/ugaefk06gjytde87xjbq.gif','1',10,2,4,'2026-07-16 10:32:44.380476',NULL),(31,'Push-Up','Start in a high plank position with your hands slightly wider than shoulder-width apart and your feet together. Engage your core and lower your body towards the ground by bending your elbows, keeping your body in a straight line. Pause when your chest is just above the ground, then push yourself back up by straightening your arms.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126867/fitness-training/exercises/gbflxiaou7yqo0v5y1s4.gif','1',10,2,5,'2026-07-16 10:32:44.380476',NULL),(32,'Scapula Push-Up','Start in a high plank position with your hands directly under your shoulders and your body in a straight line. Lower your chest towards the ground, keeping your elbows close to your body. As you lower, squeeze your shoulder blades together and push your chest forward. Pause at the bottom, then push back up to the starting position.','https://res.cloudinary.com/bucd22r4/image/upload/v1784126912/fitness-training/exercises/gs3j7ebud8huhup6zex3.gif','1',10,7,5,'2026-07-16 10:32:44.380476',NULL);
  /*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `foods`
  --

  DROP TABLE IF EXISTS `foods`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `foods` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `serving_size` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `unit` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `calories` int NOT NULL,
    `protein` decimal(65,30) NOT NULL,
    `carbs` decimal(65,30) NOT NULL,
    `fat` decimal(65,30) NOT NULL,
    `image_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `foods`
  --

  LOCK TABLES `foods` WRITE;
  /*!40000 ALTER TABLE `foods` DISABLE KEYS */;
  INSERT INTO `foods` VALUES (1,'White Rice','100','g',130,2.700000000000000000000000000000,28.000000000000000000000000000000,0.300000000000000000000000000000,NULL),(2,'Brown Rice','100','g',112,2.600000000000000000000000000000,23.500000000000000000000000000000,0.900000000000000000000000000000,NULL),(3,'Oatmeal','100','g',389,17.000000000000000000000000000000,66.000000000000000000000000000000,7.000000000000000000000000000000,NULL),(4,'Sweet Potato','100','g',86,1.600000000000000000000000000000,20.000000000000000000000000000000,0.100000000000000000000000000000,NULL),(5,'Whole Wheat Bread','1','slice',69,3.600000000000000000000000000000,12.000000000000000000000000000000,1.100000000000000000000000000000,NULL),(6,'Grilled Chicken Breast','100','g',165,31.000000000000000000000000000000,0.000000000000000000000000000000,3.600000000000000000000000000000,NULL),(7,'Whole Eggs','1','piece',78,6.000000000000000000000000000000,0.600000000000000000000000000000,5.300000000000000000000000000000,NULL),(8,'Baked Salmon','100','g',208,20.000000000000000000000000000000,0.000000000000000000000000000000,13.000000000000000000000000000000,NULL),(9,'Canned Tuna','100','g',116,26.000000000000000000000000000000,0.000000000000000000000000000000,1.000000000000000000000000000000,NULL),(10,'Lean Ground Beef','100','g',250,26.000000000000000000000000000000,0.000000000000000000000000000000,15.000000000000000000000000000000,NULL),(11,'Lean Pork Loin','100','g',143,26.000000000000000000000000000000,0.000000000000000000000000000000,3.500000000000000000000000000000,NULL),(12,'Steamed Shrimp','100','g',99,24.000000000000000000000000000000,0.200000000000000000000000000000,0.300000000000000000000000000000,NULL),(13,'Whey Protein','1','scoop',120,24.000000000000000000000000000000,3.000000000000000000000000000000,1.500000000000000000000000000000,NULL),(14,'Greek Yogurt','100','g',59,10.000000000000000000000000000000,3.600000000000000000000000000000,0.400000000000000000000000000000,NULL),(15,'Cottage Cheese','100','g',98,11.000000000000000000000000000000,3.400000000000000000000000000000,4.300000000000000000000000000000,NULL),(16,'Whole Milk','250','ml',149,8.000000000000000000000000000000,12.000000000000000000000000000000,8.000000000000000000000000000000,NULL),(17,'Avocado','100','g',160,2.000000000000000000000000000000,9.000000000000000000000000000000,15.000000000000000000000000000000,NULL),(18,'Almonds','30','g',174,6.000000000000000000000000000000,6.000000000000000000000000000000,15.000000000000000000000000000000,NULL),(19,'Peanut Butter','2','tbsp',188,8.000000000000000000000000000000,6.000000000000000000000000000000,16.000000000000000000000000000000,NULL),(20,'Olive Oil','1','tbsp',119,0.000000000000000000000000000000,0.000000000000000000000000000000,13.500000000000000000000000000000,NULL),(21,'Steamed Broccoli','100','g',55,3.700000000000000000000000000000,11.000000000000000000000000000000,0.600000000000000000000000000000,NULL),(22,'Raw Spinach','100','g',23,2.900000000000000000000000000000,3.600000000000000000000000000000,0.400000000000000000000000000000,NULL),(23,'Banana','1','piece',105,1.300000000000000000000000000000,27.000000000000000000000000000000,0.300000000000000000000000000000,NULL),(24,'Orange','1','piece',62,1.200000000000000000000000000000,15.400000000000000000000000000000,0.200000000000000000000000000000,NULL),(25,'Apple','1','piece',95,0.500000000000000000000000000000,25.000000000000000000000000000000,0.300000000000000000000000000000,NULL),(26,'Tomato','100','g',18,0.900000000000000000000000000000,3.900000000000000000000000000000,0.200000000000000000000000000000,NULL),(27,'Cucumber','100','g',15,0.700000000000000000000000000000,3.600000000000000000000000000000,0.100000000000000000000000000000,NULL),(28,'Asparagus','100','g',20,2.200000000000000000000000000000,3.800000000000000000000000000000,0.100000000000000000000000000000,NULL),(29,'White Mushrooms','100','g',22,3.100000000000000000000000000000,3.300000000000000000000000000000,0.300000000000000000000000000000,NULL),(30,'Mixed Salad Greens','100','g',15,1.500000000000000000000000000000,2.500000000000000000000000000000,0.200000000000000000000000000000,NULL);
  /*!40000 ALTER TABLE `foods` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `meal_schedule_items`
  --

  DROP TABLE IF EXISTS `meal_schedule_items`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `meal_schedule_items` (
    `id` int NOT NULL AUTO_INCREMENT,
    `meal_schedule_id` int NOT NULL,
    `food_id` int NOT NULL,
    `amount` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `is_eaten` tinyint(1) NOT NULL,
    `created_at` datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_meal_schedule_items_food_id` (`food_id`),
    KEY `ix_meal_schedule_items_meal_schedule_id` (`meal_schedule_id`),
    CONSTRAINT `fk_meal_schedule_items_foods_food_id` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_meal_schedule_items_meal_schedules_meal_schedule_id` FOREIGN KEY (`meal_schedule_id`) REFERENCES `meal_schedules` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `meal_schedule_items`
  --

  LOCK TABLES `meal_schedule_items` WRITE;
  /*!40000 ALTER TABLE `meal_schedule_items` DISABLE KEYS */;
  INSERT INTO `meal_schedule_items` VALUES (1,1,3,'80g',1,'0000-00-00 00:00:00.000000'),(2,1,7,'2 pieces',1,'0000-00-00 00:00:00.000000'),(3,1,23,'1 piece',1,'0000-00-00 00:00:00.000000'),(4,2,6,'150g',1,'0000-00-00 00:00:00.000000'),(5,2,2,'150g',1,'0000-00-00 00:00:00.000000'),(6,2,21,'100g',1,'0000-00-00 00:00:00.000000'),(7,3,13,'1 scoop',1,'0000-00-00 00:00:00.000000'),(8,3,23,'1 piece',1,'0000-00-00 00:00:00.000000'),(9,4,8,'150g',0,'0000-00-00 00:00:00.000000'),(10,4,4,'150g',0,'0000-00-00 00:00:00.000000'),(11,4,22,'80g',0,'0000-00-00 00:00:00.000000'),(12,5,14,'150g',0,'0000-00-00 00:00:00.000000'),(13,5,18,'15g',0,'0000-00-00 00:00:00.000000'),(14,6,5,'2 slices',0,'0000-00-00 00:00:00.000000'),(15,6,19,'1 tbsp',0,'0000-00-00 00:00:00.000000'),(16,6,16,'250ml',0,'0000-00-00 00:00:00.000000');
  /*!40000 ALTER TABLE `meal_schedule_items` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `meal_schedules`
  --

  DROP TABLE IF EXISTS `meal_schedules`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `meal_schedules` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `ai_recommendation_id` int DEFAULT NULL,
    `schedule_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `eat_time` time DEFAULT NULL,
    `total_calories_target` int DEFAULT NULL,
    `created_at` datetime(6) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_meal_schedules_ai_recommendation_id` (`ai_recommendation_id`),
    KEY `ix_meal_schedules_user_id` (`user_id`),
    CONSTRAINT `fk_meal_schedules_ai_recommendations_ai_recommendation_id` FOREIGN KEY (`ai_recommendation_id`) REFERENCES `ai_recommendations` (`id`),
    CONSTRAINT `fk_meal_schedules_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `meal_schedules`
  --

  LOCK TABLES `meal_schedules` WRITE;
  /*!40000 ALTER TABLE `meal_schedules` DISABLE KEYS */;
  INSERT INTO `meal_schedules` VALUES (1,3,2,'Breakfast','07:00:00',500,'2026-03-11 09:05:00.000000'),(2,3,2,'Lunch','12:00:00',580,'2026-03-11 09:05:00.000000'),(3,3,2,'Post-Workout Snack','16:00:00',225,'2026-03-11 09:05:00.000000'),(4,3,2,'Dinner','19:00:00',420,'2026-03-11 09:05:00.000000'),(5,3,2,'Evening Snack','21:00:00',175,'2026-03-11 09:05:00.000000'),(6,3,NULL,'Pre-Workout Meal','07:30:00',380,'2026-06-02 12:00:00.000000');
  /*!40000 ALTER TABLE `meal_schedules` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `membership_subscriptions`
  --

  DROP TABLE IF EXISTS `membership_subscriptions`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `membership_subscriptions` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `package_id` int NOT NULL,
    `order_id` int DEFAULT NULL,
    `start_date` datetime(6) NOT NULL,
    `end_date` datetime(6) NOT NULL,
    `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`id`),
    UNIQUE KEY `ix_membership_subscriptions_order_id` (`order_id`),
    KEY `ix_membership_subscriptions_package_id` (`package_id`),
    KEY `ix_membership_subscriptions_user_id` (`user_id`),
    CONSTRAINT `fk_membership_subscriptions_product_packages_package_id` FOREIGN KEY (`package_id`) REFERENCES `product_packages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_membership_subscriptions_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `membership_subscriptions`
  --

  LOCK TABLES `membership_subscriptions` WRITE;
  /*!40000 ALTER TABLE `membership_subscriptions` DISABLE KEYS */;
  INSERT INTO `membership_subscriptions` VALUES (1,3,1,1,'2025-01-05 00:00:00.000000','2025-02-04 00:00:00.000000','EXPIRED'),(2,3,2,2,'2025-03-10 00:00:00.000000','2025-06-07 00:00:00.000000','EXPIRED'),(3,3,6,4,'2025-06-01 00:00:00.000000','2025-08-24 00:00:00.000000','ACTIVE'),(4,2,5,10,'2026-07-16 16:02:21.000000','2026-08-15 16:02:21.000000','ACTIVE'),(5,1,1,11,'2026-07-16 16:02:21.000000','2026-08-15 16:02:21.000000','ACTIVE'),(6,5,1,12,'2026-07-16 09:32:23.202975','2026-08-15 09:32:23.203011','CANCELLED'),(7,5,1,14,'2026-07-16 09:34:41.074588','2026-08-15 09:34:41.074588','ACTIVE');
  /*!40000 ALTER TABLE `membership_subscriptions` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `muscle_groups`
  --

  DROP TABLE IF EXISTS `muscle_groups`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `muscle_groups` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `muscle_groups`
  --

  LOCK TABLES `muscle_groups` WRITE;
  /*!40000 ALTER TABLE `muscle_groups` DISABLE KEYS */;
  INSERT INTO `muscle_groups` VALUES (1,'Chest','Pectoralis major and minor muscles'),(2,'Back','Latissimus dorsi, trapezius, and rhomboids'),(3,'Legs','Quadriceps, hamstrings, glutes, and calves'),(4,'Shoulders','Deltoids and rotator cuff muscles'),(5,'Arms','Biceps, triceps, and forearms'),(6,'Core','Abdominals, obliques, and lower back'),(7,'Full Body','Compound movements engaging multiple muscle groups');
  /*!40000 ALTER TABLE `muscle_groups` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `notifications`
  --

  DROP TABLE IF EXISTS `notifications`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `notifications` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `is_read` tinyint(1) DEFAULT NULL,
    `created_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_notifications_user_id` (`user_id`),
    CONSTRAINT `fk_notifications_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `notifications`
  --

  LOCK TABLES `notifications` WRITE;
  /*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
  INSERT INTO `notifications` VALUES (1,3,'Welcome to FitnessPro!','Your account is ready. Check out your AI workout plan to get started.','SYSTEM',1,'2025-01-05 09:20:00.000000'),(2,3,'First Session Completed','Great work finishing your first workout session! Keep it up.','WORKOUT',1,'2025-01-10 09:05:00.000000'),(3,3,'Membership Active','Your 1-month gym membership is now active. Expires on Feb 4, 2025.','MEMBERSHIP',1,'2025-01-05 09:18:00.000000'),(4,3,'Membership Renewed','Your 3-month membership is now active. Expires on Jun 7, 2025.','MEMBERSHIP',1,'2025-03-10 14:35:00.000000'),(5,3,'Schedule Confirmed','Your training session with Huan Luyen Vien on Feb 17 at 8:00 AM is confirmed.','SCHEDULE',1,'2025-02-15 10:00:00.000000'),(6,3,'Payment Successful','Payment of 499,000 VND for Online 12-Week Shred was received. Enjoy the program!','PAYMENT',1,'2025-06-01 11:06:00.000000'),(7,3,'New AI Plan Ready','Your 5-day hypertrophy split is ready. Head to Workouts to start your first session.','WORKOUT',1,'2025-06-02 11:36:00.000000'),(8,3,'Upcoming Session Tomorrow','Reminder: training session with Huan Luyen Vien tomorrow at 8:00 AM.','SCHEDULE',0,'2025-06-22 08:00:00.000000'),(9,3,'Membership Expiring Soon','Your Online 12-Week Shred package expires on Aug 24. Consider renewing early.','MEMBERSHIP',0,'2025-06-20 07:00:00.000000'),(10,2,'New Session Booked','Hoi Vien has booked a training session on Jun 23 at 8:00 AM.','SCHEDULE',1,'2025-06-18 10:00:00.000000'),(11,2,'Pending Upload Request','Your exercise upload \"Incline Dumbbell Press Tutorial\" is pending admin review.','SYSTEM',1,'2025-05-15 14:00:00.000000'),(12,1,'New Exercise Upload Request','Huan Luyen Vien submitted \"Incline Dumbbell Press Tutorial\" for review.','SYSTEM',0,'2025-05-15 14:01:00.000000'),(13,1,'New Order Pending Payment','Order #5 from Hoi Vien is awaiting payment confirmation.','PAYMENT',0,'2025-06-20 08:46:00.000000'),(14,5,'Time to Drink Water! ?','Bạn còn 9 cốc nước cần uống trước 22:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',1,'2026-07-16 04:06:30.920780'),(15,5,'Time to Drink Water! ?','Keep your body hydrated! Drink a glass of water now. Click here to log it instantly.','WATER_REMINDER',1,'2026-07-16 04:24:41.892704'),(16,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 07:05:10.041290'),(17,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 08:14:12.876485'),(18,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 09:03:30.128379'),(19,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 09:34:05.545430'),(20,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 10:24:15.135908'),(21,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 10:54:15.263213'),(22,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 11:24:15.287804'),(23,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 11:54:15.300876'),(24,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 12:24:15.329553'),(25,5,'Time to Drink Water! ?','Bạn còn 8 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-16 12:54:15.339951'),(26,5,'Time to Drink Water! ?','Bạn còn 7 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-17 10:24:32.264120'),(27,5,'Time to Drink Water! ?','Bạn còn 7 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-17 10:54:32.326685'),(28,5,'Time to Drink Water! ?','Bạn còn 7 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-17 11:24:32.358574'),(29,5,'Time to Drink Water! ?','Bạn còn 7 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-17 11:54:32.392418'),(30,5,'Time to Drink Water! ?','Bạn còn 7 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-17 12:24:32.416344'),(31,5,'Time to Drink Water! ?','Bạn còn 7 cốc nước cần uống trước 20:00. Hãy bổ sung ngay một cốc nước nhé!','WATER_REMINDER',0,'2026-07-17 12:54:32.468244');
  /*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `orders`
  --

  DROP TABLE IF EXISTS `orders`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `orders` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL DEFAULT '0',
    `package_id` int NOT NULL DEFAULT '0',
    `price_paid` decimal(65,30) NOT NULL,
    `payment_status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `purchased_at` datetime(6) NOT NULL,
    `order_code` bigint NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `ix_orders_package_id` (`package_id`),
    KEY `ix_orders_user_id` (`user_id`),
    CONSTRAINT `fk_orders_product_packages_package_id` FOREIGN KEY (`package_id`) REFERENCES `product_packages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_orders_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `orders`
  --

  LOCK TABLES `orders` WRITE;
  /*!40000 ALTER TABLE `orders` DISABLE KEYS */;
  INSERT INTO `orders` VALUES (1,3,1,350000.000000000000000000000000000000,'Pending','2025-01-05 09:15:00.000000',0),(2,3,2,900000.000000000000000000000000000000,'Pending','2025-03-10 14:30:00.000000',0),(3,3,5,199000.000000000000000000000000000000,'Pending','2025-05-01 10:00:00.000000',0),(4,3,6,499000.000000000000000000000000000000,'Pending','2025-06-01 11:00:00.000000',0),(5,3,1,350000.000000000000000000000000000000,'Pending','2025-06-20 08:45:00.000000',0),(6,5,1,350000.000000000000000000000000000000,'Pending','2026-07-16 07:14:06.744987',260716141406743),(7,5,1,5000.000000000000000000000000000000,'Pending','2026-07-16 07:16:39.877313',260716141639877),(8,5,2,900000.000000000000000000000000000000,'Pending','2026-07-16 07:29:15.614389',260716142915614),(9,5,1,5000.000000000000000000000000000000,'Pending','2026-07-16 08:39:42.173154',260716153942172),(10,2,5,199000.000000000000000000000000000000,'Paid','2026-07-16 16:02:21.000000',2507160001),(11,1,1,350000.000000000000000000000000000000,'Paid','2026-07-16 16:02:21.000000',2507160002),(12,5,1,5000.000000000000000000000000000000,'Paid','2026-07-16 09:26:31.373614',260716162631373),(13,5,1,5000.000000000000000000000000000000,'Pending','2026-07-16 09:27:46.964869',260716162746964),(14,5,1,5000.000000000000000000000000000000,'Paid','2026-07-16 09:34:09.635554',260716163409635);
  /*!40000 ALTER TABLE `orders` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `payments`
  --

  DROP TABLE IF EXISTS `payments`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `payments` (
    `id` int NOT NULL AUTO_INCREMENT,
    `order_id` int NOT NULL,
    `payment_method` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `transaction_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `amount` decimal(65,30) NOT NULL,
    `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `paid_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_payments_order_id` (`order_id`),
    CONSTRAINT `fk_payments_orders_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `payments`
  --

  LOCK TABLES `payments` WRITE;
  /*!40000 ALTER TABLE `payments` DISABLE KEYS */;
  INSERT INTO `payments` VALUES (1,1,'MOMO','MOMO-20250105-001',350000.000000000000000000000000000000,'SUCCESS','2025-01-05 09:17:00.000000'),(2,2,'VNPAY','VNP-20250310-002',900000.000000000000000000000000000000,'SUCCESS','2025-03-10 14:33:00.000000'),(3,3,'MOMO',NULL,199000.000000000000000000000000000000,'FAILED',NULL),(4,4,'PAYOS','PAYOS-20250601-004',499000.000000000000000000000000000000,'SUCCESS','2025-06-01 11:05:00.000000'),(5,5,'BANK_TRANSFER',NULL,350000.000000000000000000000000000000,'PENDING',NULL),(6,12,'PayOs','260716162631373',5000.000000000000000000000000000000,'SUCCESS','2026-07-16 09:32:23.147077'),(7,14,'PayOs','260716163409635',5000.000000000000000000000000000000,'SUCCESS','2026-07-16 09:34:41.072354');
  /*!40000 ALTER TABLE `payments` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `product_packages`
  --

  DROP TABLE IF EXISTS `product_packages`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `product_packages` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `price` decimal(65,30) NOT NULL,
    `duration_days` int NOT NULL,
    `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `is_active` tinyint(1) NOT NULL,
    `is_popular` tinyint(1) NOT NULL,
    `tier` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `product_packages`
  --

  LOCK TABLES `product_packages` WRITE;
  /*!40000 ALTER TABLE `product_packages` DISABLE KEYS */;
  INSERT INTO `product_packages` VALUES (1,'1-Month Gym Membership','0',5000.000000000000000000000000000000,30,'Full access to gym facilities for 1 month.',1,1,2),(2,'3-Month Gym Membership','0',900000.000000000000000000000000000000,90,'Full access to gym facilities for 3 months. Save 14%.',1,0,3),(3,'6-Month Gym Membership','0',1600000.000000000000000000000000000000,180,'Full access to gym facilities for 6 months.',1,0,3),(4,'1-Year Gym Membership','0',2800000.000000000000000000000000000000,365,'Annual membership with unlimited access and 1 free PT session.',1,0,4),(5,'Online Beginner Program','0',199000.000000000000000000000000000000,30,'30-day beginner program with video guides. Train from home.',1,0,1),(6,'Online 12-Week Shred','0',499000.000000000000000000000000000000,84,'12-week fat-loss program with structured HIIT and nutrition tips.',1,0,1),(7,'Online Strength Builder','0',599000.000000000000000000000000000000,90,'90-day progressive overload strength program for intermediate lifters.',1,1,1),(8,'1-Month Membership (Old)','0',300000.000000000000000000000000000000,30,'Legacy pricing tier. No longer sold.',0,0,0);
  /*!40000 ALTER TABLE `product_packages` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `pt_profiles`
  --

  DROP TABLE IF EXISTS `pt_profiles`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `pt_profiles` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `bio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `experience_years` int DEFAULT NULL,
    `rating` decimal(65,30) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `ix_pt_profiles_user_id` (`user_id`),
    CONSTRAINT `fk_pt_profiles_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `pt_profiles`
  --

  LOCK TABLES `pt_profiles` WRITE;
  /*!40000 ALTER TABLE `pt_profiles` DISABLE KEYS */;
  INSERT INTO `pt_profiles` VALUES (1,2,'Certified strength and conditioning coach with 7 years of hands-on experience helping members reach their physique and performance goals.',7,4.900000000000000000000000000000),(2,7,NULL,1,5.000000000000000000000000000000);
  /*!40000 ALTER TABLE `pt_profiles` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `pt_upload_requests`
  --

  DROP TABLE IF EXISTS `pt_upload_requests`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `pt_upload_requests` (
    `id` int NOT NULL AUTO_INCREMENT,
    `pt_id` int NOT NULL,
    `exercise_id` int DEFAULT NULL,
    `title` longtext COLLATE utf8mb4_unicode_ci,
    `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `video_url` longtext COLLATE utf8mb4_unicode_ci,
    `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `admin_id` int DEFAULT NULL,
    `review_note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `submitted_at` datetime(6) DEFAULT NULL,
    `reviewed_at` datetime(6) DEFAULT NULL,
    `deadline` datetime(6) DEFAULT NULL,
    `difficulty` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `duration` int DEFAULT NULL,
    `instructions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `muscle_group` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `priority` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `requested_by` int DEFAULT NULL,
    `requested_by_user_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_pt_upload_requests_admin_id` (`admin_id`),
    KEY `ix_pt_upload_requests_exercise_id` (`exercise_id`),
    KEY `ix_pt_upload_requests_pt_id` (`pt_id`),
    KEY `ix_pt_upload_requests_requested_by_user_id` (`requested_by_user_id`),
    CONSTRAINT `fk_pt_upload_requests_exercises_exercise_id` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
    CONSTRAINT `fk_pt_upload_requests_users_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_pt_upload_requests_users_pt_id` FOREIGN KEY (`pt_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pt_upload_requests_users_requested_by_user_id` FOREIGN KEY (`requested_by_user_id`) REFERENCES `users` (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `pt_upload_requests`
  --

  LOCK TABLES `pt_upload_requests` WRITE;
  /*!40000 ALTER TABLE `pt_upload_requests` DISABLE KEYS */;
  INSERT INTO `pt_upload_requests` VALUES (1,2,1,'Warmup Exercise 1 Tutorial','Step-by-step guide to proper warmup exercise 1 form, covering setup and range of motion.','https://example.com/uploads/warmup-exercise-1.mp4','PENDING',NULL,NULL,'2025-05-15 14:00:00.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,2,NULL,'Cable Fly Chest Isolation Guide','Demonstration of cable fly with emphasis on mind-muscle connection and proper arc path.','https://example.com/uploads/cable-fly.mp4','APPROVED',1,'Good demonstration. Clean form cues. Approved.','2025-02-20 10:00:00.000000','2025-02-22 09:30:00.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,2,NULL,'Jump Rope HIIT Routine','20-minute jump rope HIIT circuit for cardiovascular conditioning.','https://example.com/uploads/jump-rope-hiit.mp4','REJECTED',1,'Video resolution too low. Please re-upload at minimum 1080p.','2025-04-10 11:00:00.000000','2025-04-12 14:00:00.000000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
  /*!40000 ALTER TABLE `pt_upload_requests` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `roles`
  --

  DROP TABLE IF EXISTS `roles`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `roles` (
    `id` int NOT NULL AUTO_INCREMENT,
    `role_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `roles`
  --

  LOCK TABLES `roles` WRITE;
  /*!40000 ALTER TABLE `roles` DISABLE KEYS */;
  INSERT INTO `roles` VALUES (1,'Admin'),(2,'PT'),(3,'Member');
  /*!40000 ALTER TABLE `roles` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `schedules`
  --

  DROP TABLE IF EXISTS `schedules`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `schedules` (
    `id` int NOT NULL AUTO_INCREMENT,
    `pt_id` int DEFAULT NULL,
    `member_id` int DEFAULT NULL,
    `start_time` datetime(6) NOT NULL,
    `end_time` datetime(6) NOT NULL,
    `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `meeting_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `note` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`id`),
    KEY `ix_schedules_member_id` (`member_id`),
    KEY `ix_schedules_pt_id` (`pt_id`),
    CONSTRAINT `fk_schedules_users_member_id` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_schedules_users_pt_id` FOREIGN KEY (`pt_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
  ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `schedules`
  --

  LOCK TABLES `schedules` WRITE;
  /*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
  INSERT INTO `schedules` VALUES (1,2,3,'2025-02-10 08:00:00.000000','2025-02-10 09:00:00.000000','2',NULL,NULL),(2,2,3,'2025-02-17 08:00:00.000000','2025-02-17 09:00:00.000000','2',NULL,NULL),(3,2,3,'2025-02-24 08:00:00.000000','2025-02-24 09:00:00.000000','2',NULL,NULL),(4,2,3,'2025-03-03 08:00:00.000000','2025-03-03 09:00:00.000000','2',NULL,NULL),(5,2,3,'2025-06-23 08:00:00.000000','2025-06-23 09:00:00.000000','1',NULL,NULL),(6,2,3,'2025-06-30 08:00:00.000000','2025-06-30 09:00:00.000000','0',NULL,NULL),(7,2,3,'2025-04-07 08:00:00.000000','2025-04-07 09:00:00.000000','3',NULL,NULL);
  /*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `users`
  --

  DROP TABLE IF EXISTS `users`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `fullname` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `password_hash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `google_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `phone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `avatar_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `gender` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `date_of_birth` datetime(6) DEFAULT NULL,
    `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `fitness_goal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `updated_at` datetime(6) DEFAULT NULL,
    `password_changed_at` datetime(6) DEFAULT NULL,
    `role_id` int DEFAULT NULL,
    `created_at` datetime(6) NOT NULL,
    `water_reminder_start_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `water_reminder_end_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `is_email_verified` tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `ix_users_role_id` (`role_id`),
    CONSTRAINT `fk_users_roles_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `users`
  --

  LOCK TABLES `users` WRITE;
  /*!40000 ALTER TABLE `users` DISABLE KEYS */;
  INSERT INTO `users` VALUES (1,'Admin','admin@fitnessproject.com','$2a$11$lF6auB5h0ti8YD62IfLGruwCnAZfJQu3BOvRm3oSUwG7i05ABgRx.',NULL,'0900000001',NULL,'male','2001-07-17 03:13:34.242203','ACTIVE',NULL,NULL,NULL,1,'2026-07-14 10:47:41.000000',NULL,NULL,0),(2,'Le Van Dat','pt@fitnessproject.com','$2a$11$sEYV1smMuelqqxZzcYS1ruIeZs8gI0imYwSIMWo4LEP.Jvv.YS84G',NULL,'0900000002','https://res.cloudinary.com/bucd22r4/image/upload/v1784109115/fitness-training/avatars/miwfyebhnz50ddfw52s6.jpg','male','2001-07-17 08:37:01.691963','ACTIVE',NULL,'2026-07-15 09:54:07.720335','2026-07-15 09:52:22.295989',2,'2026-07-14 10:47:41.000000','07:00','22:00',0),(3,'Member - Hoi Vien','member@fitnessproject.com','$2a$11$WvMAcpfehU8zKAh8Mx0DHu7OzCzkdq.Yjd6IFuNM9ew939HAJ4hSG',NULL,'0900000003',NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,3,'2026-07-14 10:47:41.000000',NULL,NULL,0),(5,'Dat Le','lvd27012004@gmail.com','','104275197933380558868',NULL,NULL,'male','2001-07-16 03:39:15.616200','ACTIVE','MAINTAIN',NULL,NULL,3,'2026-07-14 04:34:19.946399','07:00','20:00',0),(6,'Le Van Dat (K18 DN)','datlvde180983@fpt.edu.vn','','109653592243158745281',NULL,NULL,'male','2001-07-16 08:39:30.159898','ACTIVE','MAINTAIN',NULL,NULL,3,'2026-07-16 08:39:17.721693',NULL,NULL,0),(7,'Dat Le','Pt2@fitnessproject.com','$2a$11$fiq4paUWZGepgnV4F4sQa.V4YEZlz9TYTKfLE0UyF.d6i37PimSri',NULL,'7616236123',NULL,'male','2004-07-17 04:52:43.926893','ACTIVE','MAINTAIN',NULL,NULL,2,'2026-07-17 04:52:10.677802',NULL,NULL,0);
  /*!40000 ALTER TABLE `users` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `workout_plan_exercises`
  --

  DROP TABLE IF EXISTS `workout_plan_exercises`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `workout_plan_exercises` (
    `id` int NOT NULL AUTO_INCREMENT,
    `workout_plan_id` int NOT NULL,
    `exercise_id` int NOT NULL,
    `sets` int DEFAULT NULL,
    `reps` int DEFAULT NULL,
    `duration_seconds` int DEFAULT NULL,
    `rest_seconds` int DEFAULT NULL,
    `exercise_order` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_workout_plan_exercises_exercise_id` (`exercise_id`),
    KEY `ix_workout_plan_exercises_workout_plan_id` (`workout_plan_id`),
    CONSTRAINT `fk_workout_plan_exercises_exercises_exercise_id` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_workout_plan_exercises_workout_plans_workout_plan_id` FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plans` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `workout_plan_exercises`
  --

  LOCK TABLES `workout_plan_exercises` WRITE;
  /*!40000 ALTER TABLE `workout_plan_exercises` DISABLE KEYS */;
  INSERT INTO `workout_plan_exercises` VALUES (1,1,1,4,8,NULL,120,1),(2,1,2,3,10,NULL,90,2),(3,1,3,3,12,NULL,90,3),(4,1,4,4,6,NULL,180,4),(5,1,5,3,10,NULL,90,5),(6,1,6,3,12,NULL,60,6),(7,1,7,4,8,NULL,90,7),(8,1,8,3,12,NULL,60,8),(9,1,9,3,15,NULL,60,9),(10,1,10,4,NULL,30,30,10),(11,2,1,4,10,NULL,90,1),(12,2,2,3,12,NULL,75,2),(13,2,3,3,15,NULL,60,3),(14,2,4,4,5,NULL,180,4),(15,2,5,4,8,NULL,90,5),(16,2,6,3,12,NULL,60,6),(17,2,7,4,8,NULL,180,7),(18,2,8,3,10,NULL,90,8),(19,2,9,3,12,NULL,60,9),(20,2,10,4,8,NULL,120,10),(21,3,1,3,8,NULL,180,1),(22,3,2,3,8,NULL,120,2),(23,3,8,3,5,NULL,180,3),(24,3,9,3,NULL,60,45,4),(25,4,30,4,16,0,60,1),(26,4,13,4,16,0,60,2),(27,4,8,4,16,0,60,3),(28,4,27,4,16,0,60,4),(29,4,29,4,16,0,60,5),(30,4,21,4,16,0,60,6),(31,5,28,3,16,0,60,1),(32,5,12,3,16,0,60,2),(33,5,18,3,16,0,60,3),(34,5,6,3,16,0,60,4),(35,5,4,3,16,0,60,5),(36,5,32,3,16,0,60,6),(37,5,16,3,32,0,60,7),(38,6,19,4,16,0,60,1),(39,6,4,4,16,0,60,2),(40,6,30,4,16,0,60,3),(41,6,32,4,16,0,60,4),(42,6,5,4,16,0,60,5),(43,6,24,4,16,0,60,6),(44,7,20,4,16,0,60,1),(45,7,24,4,16,0,60,2),(46,8,2,4,12,0,60,1),(47,8,24,9,12,0,60,2),(48,8,20,9,12,0,60,3),(49,9,19,5,12,0,60,1),(50,9,30,10,16,0,60,2),(51,9,22,10,16,0,60,3);
  /*!40000 ALTER TABLE `workout_plan_exercises` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `workout_plans`
  --

  DROP TABLE IF EXISTS `workout_plans`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `workout_plans` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `ai_recommendation_id` int DEFAULT NULL,
    `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `goal` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `target_calories` int DEFAULT NULL,
    `target_duration_minutes` int DEFAULT NULL,
    `created_by_ai` tinyint(1) DEFAULT NULL,
    `created_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_workout_plans_ai_recommendation_id` (`ai_recommendation_id`),
    KEY `ix_workout_plans_user_id` (`user_id`),
    CONSTRAINT `fk_workout_plans_ai_recommendations_ai_recommendation_id` FOREIGN KEY (`ai_recommendation_id`) REFERENCES `ai_recommendations` (`id`),
    CONSTRAINT `fk_workout_plans_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `workout_plans`
  --

  LOCK TABLES `workout_plans` WRITE;
  /*!40000 ALTER TABLE `workout_plans` DISABLE KEYS */;
  INSERT INTO `workout_plans` VALUES (1,3,1,'4-Day Body Recomposition','Build muscle and lose fat',450,60,1,'2025-01-06 10:05:00.000000'),(2,3,3,'5-Day Hypertrophy Split','Maximize muscle size (intermediate)',500,75,1,'2025-06-02 11:35:00.000000'),(3,3,NULL,'PT Custom Plan','Improve overall strength and technique',400,60,0,'2025-02-10 09:30:00.000000'),(4,5,NULL,'AI Plan: lose_weight','lose_weight',300,30,1,'2026-07-16 03:39:31.263741'),(5,5,NULL,'AI Plan: lose_weight','lose_weight',300,30,1,'2026-07-16 04:01:35.942296'),(6,5,NULL,'AI Plan: lose_weight','lose_weight',300,30,1,'2026-07-16 04:15:07.318408'),(7,5,NULL,'AI Plan: lose_weight','lose_weight',300,30,1,'2026-07-16 04:21:51.246920'),(8,5,NULL,'AI Plan: stay_active','stay_active',300,30,1,'2026-07-16 04:46:19.354717'),(9,5,NULL,'AI Plan: lose_weight','lose_weight',300,30,1,'2026-07-16 05:04:07.046785'),(16,5,NULL,'AI Plan: lose_weight','lose_weight',300,30,1,'2026-07-16 09:15:00.289099'),(17,5,NULL,'AI Plan: build_muscle','build_muscle',300,30,1,'2026-07-16 09:15:13.960274');
  /*!40000 ALTER TABLE `workout_plans` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `workout_session_details`
  --

  DROP TABLE IF EXISTS `workout_session_details`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `workout_session_details` (
    `id` int NOT NULL AUTO_INCREMENT,
    `workout_session_id` int NOT NULL,
    `exercise_id` int NOT NULL,
    `sets_done` int DEFAULT NULL,
    `reps_done` int DEFAULT NULL,
    `duration_seconds` int DEFAULT NULL,
    `calories_burned` decimal(65,30) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_workout_session_details_exercise_id` (`exercise_id`),
    KEY `ix_workout_session_details_workout_session_id` (`workout_session_id`),
    CONSTRAINT `fk_workout_session_details_exercises_exercise_id` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_workout_session_details_workout_sessions_workout_session_id` FOREIGN KEY (`workout_session_id`) REFERENCES `workout_sessions` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `workout_session_details`
  --

  LOCK TABLES `workout_session_details` WRITE;
  /*!40000 ALTER TABLE `workout_session_details` DISABLE KEYS */;
  INSERT INTO `workout_session_details` VALUES (1,1,1,4,8,NULL,110.000000000000000000000000000000),(2,1,2,3,10,NULL,85.000000000000000000000000000000),(3,1,3,3,12,NULL,55.000000000000000000000000000000),(4,1,10,3,NULL,60,20.000000000000000000000000000000),(5,2,4,4,6,NULL,200.000000000000000000000000000000),(6,2,5,3,10,NULL,120.000000000000000000000000000000),(7,2,6,3,12,NULL,75.000000000000000000000000000000),(8,3,1,3,8,NULL,160.000000000000000000000000000000),(9,3,2,3,8,NULL,95.000000000000000000000000000000),(10,3,8,3,5,NULL,125.000000000000000000000000000000),(11,4,1,3,8,NULL,155.000000000000000000000000000000),(12,4,2,3,9,NULL,100.000000000000000000000000000000),(13,4,9,3,NULL,60,20.000000000000000000000000000000),(14,5,7,4,8,NULL,100.000000000000000000000000000000),(15,5,8,4,NULL,30,195.000000000000000000000000000000),(16,5,9,3,NULL,45,175.000000000000000000000000000000),(17,7,1,4,10,NULL,115.000000000000000000000000000000),(18,7,2,3,12,NULL,90.000000000000000000000000000000),(19,7,3,3,15,NULL,55.000000000000000000000000000000),(20,8,4,2,5,NULL,110.000000000000000000000000000000),(21,9,30,4,16,0,30.000000000000000000000000000000),(22,9,13,4,16,0,30.000000000000000000000000000000),(23,9,8,4,16,0,30.000000000000000000000000000000),(24,9,27,4,16,0,30.000000000000000000000000000000),(25,9,29,4,16,0,30.000000000000000000000000000000),(26,9,21,4,16,0,30.000000000000000000000000000000),(27,11,28,3,16,0,30.000000000000000000000000000000),(28,11,12,3,16,0,30.000000000000000000000000000000),(29,11,18,3,16,0,30.000000000000000000000000000000),(30,11,6,3,16,0,30.000000000000000000000000000000),(31,11,4,3,16,0,30.000000000000000000000000000000),(32,11,32,3,16,0,30.000000000000000000000000000000),(33,11,16,3,32,0,30.000000000000000000000000000000),(34,15,20,4,16,0,30.000000000000000000000000000000),(35,15,24,4,16,0,30.000000000000000000000000000000),(36,18,2,4,12,0,30.000000000000000000000000000000),(37,18,24,9,12,0,30.000000000000000000000000000000),(38,18,20,9,12,0,30.000000000000000000000000000000),(39,20,19,5,12,308,30.000000000000000000000000000000),(40,20,30,10,16,770,30.000000000000000000000000000000),(41,20,22,10,16,770,30.000000000000000000000000000000);
  /*!40000 ALTER TABLE `workout_session_details` ENABLE KEYS */;
  UNLOCK TABLES;

  --
  -- Table structure for table `workout_sessions`
  --

  DROP TABLE IF EXISTS `workout_sessions`;
  /*!40101 SET @saved_cs_client     = @@character_set_client */;
  /*!50503 SET character_set_client = utf8mb4 */;
  CREATE TABLE `workout_sessions` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `workout_plan_id` int DEFAULT NULL,
    `total_duration_minutes` int DEFAULT NULL,
    `total_calories_burned` decimal(65,30) DEFAULT NULL,
    `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `started_at` datetime(6) DEFAULT NULL,
    `completed_at` datetime(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `ix_workout_sessions_user_id` (`user_id`),
    KEY `ix_workout_sessions_workout_plan_id` (`workout_plan_id`),
    CONSTRAINT `fk_workout_sessions_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_workout_sessions_workout_plans_workout_plan_id` FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plans` (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  /*!40101 SET character_set_client = @saved_cs_client */;

  --
  -- Dumping data for table `workout_sessions`
  --

  LOCK TABLES `workout_sessions` WRITE;
  /*!40000 ALTER TABLE `workout_sessions` DISABLE KEYS */;
  INSERT INTO `workout_sessions` VALUES (1,3,1,62,445.000000000000000000000000000000,'COMPLETED','2025-01-10 08:00:00.000000','2025-01-10 09:02:00.000000'),(2,3,1,68,490.000000000000000000000000000000,'COMPLETED','2025-01-13 08:00:00.000000','2025-01-13 09:08:00.000000'),(3,3,3,58,380.000000000000000000000000000000,'COMPLETED','2025-02-10 08:05:00.000000','2025-02-10 09:03:00.000000'),(4,3,3,55,360.000000000000000000000000000000,'COMPLETED','2025-02-17 08:05:00.000000','2025-02-17 09:00:00.000000'),(5,3,1,70,510.000000000000000000000000000000,'COMPLETED','2025-03-15 08:00:00.000000','2025-03-15 09:10:00.000000'),(6,3,1,0,0.000000000000000000000000000000,'CANCELLED','2025-04-01 08:00:00.000000',NULL),(7,3,2,78,560.000000000000000000000000000000,'COMPLETED','2025-06-05 07:30:00.000000','2025-06-05 08:48:00.000000'),(8,3,2,15,110.000000000000000000000000000000,'IN_PROGRESS','2025-06-22 08:00:00.000000',NULL),(9,5,4,30,300.000000000000000000000000000000,'COMPLETED','2026-07-16 03:39:34.691069','2026-07-16 03:42:59.605761'),(10,5,4,NULL,NULL,'IN_PROGRESS','2026-07-16 03:39:34.691067',NULL),(11,5,5,30,300.000000000000000000000000000000,'COMPLETED','2026-07-16 04:01:39.342820','2026-07-16 04:11:56.499277'),(12,5,5,NULL,NULL,'IN_PROGRESS','2026-07-16 04:01:39.342820',NULL),(13,5,6,NULL,NULL,'IN_PROGRESS','2026-07-16 04:15:10.724324',NULL),(14,5,6,NULL,NULL,'IN_PROGRESS','2026-07-16 04:15:10.724324',NULL),(15,5,7,30,300.000000000000000000000000000000,'COMPLETED','2026-07-16 04:21:54.621862','2026-07-16 04:24:56.045741'),(16,5,7,NULL,NULL,'IN_PROGRESS','2026-07-16 04:21:54.621864',NULL),(17,5,8,NULL,NULL,'IN_PROGRESS','2026-07-16 04:46:22.745828',NULL),(18,5,8,30,300.000000000000000000000000000000,'COMPLETED','2026-07-16 04:46:22.745826','2026-07-16 05:03:59.539139'),(19,5,9,NULL,NULL,'IN_PROGRESS','2026-07-16 05:04:10.437029',NULL),(20,5,9,30,300.000000000000000000000000000000,'COMPLETED','2026-07-16 05:04:10.437031','2026-07-16 05:05:36.616847'),(21,5,16,NULL,NULL,'IN_PROGRESS','2026-07-16 09:15:03.682460',NULL),(22,5,16,30,300.000000000000000000000000000000,'COMPLETED','2026-07-16 09:15:03.682491','2026-07-16 09:15:05.793594'),(23,5,17,30,300.000000000000000000000000000000,'COMPLETED','2026-07-16 09:15:17.308387','2026-07-16 09:21:04.193150'),(24,5,17,NULL,NULL,'IN_PROGRESS','2026-07-16 09:15:17.308353',NULL);
  /*!40000 ALTER TABLE `workout_sessions` ENABLE KEYS */;
  UNLOCK TABLES;
  /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
DROP TABLE IF EXISTS ai_diet_histories;
DROP TABLE IF EXISTS ai_chat_messages;
DROP TABLE IF EXISTS ai_chat_sessions;

-- =====================================
-- AI CHAT SESSIONS
-- =====================================
CREATE TABLE ai_chat_sessions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    status ENUM('active', 'archived', 'closed') NOT NULL DEFAULT 'active', -- Đổi sang ENUM
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                -- Tự động sinh thời gian
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tự động cập nhật khi sửa
    CONSTRAINT fk_ai_chat_sessions_users
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =====================================
-- AI CHAT MESSAGES
-- =====================================
CREATE TABLE ai_chat_messages(
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    sender ENUM('user', 'ai', 'system') NOT NULL, -- Đổi sang ENUM để kiểm soát chặt chẽ
    message LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Tự động sinh thời gian
    CONSTRAINT fk_ai_chat_messages_sessions
        FOREIGN KEY(session_id)
        REFERENCES ai_chat_sessions(id)
        ON DELETE CASCADE
);

-- =====================================
-- AI DIET HISTORY
-- =====================================
CREATE TABLE ai_diet_histories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id INT NULL,
    diet_title VARCHAR(255) NOT NULL,
    total_calories INT NOT NULL,
    protein INT NOT NULL,
    carbs INT NOT NULL,
    fat INT NOT NULL,
    raw_json LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_ai_diet_users
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ai_diet_sessions
        FOREIGN KEY(session_id)
        REFERENCES ai_chat_sessions(id)
        ON DELETE SET NULL
);


CREATE INDEX ix_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX ix_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX ix_ai_diet_histories_user_id ON ai_diet_histories(user_id);
CREATE INDEX ix_ai_diet_histories_session_id ON ai_diet_histories(session_id);
  

  /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
  /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
  /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
  /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
  /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
  /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
  /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

  -- Dump completed on 2026-07-19 15:13:31
