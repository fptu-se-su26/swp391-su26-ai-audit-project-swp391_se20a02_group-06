-- ==========================================
-- FITNESSPROJECT - MOCK DATA
-- ==========================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

USE FitnessProject;

-- ==========================================
-- TRUNCATE ALL TABLES (clean re-seed)
-- ==========================================
TRUNCATE TABLE pt_upload_requests;
TRUNCATE TABLE notifications;
TRUNCATE TABLE meal_schedule_items;
TRUNCATE TABLE meal_schedules;
TRUNCATE TABLE workout_session_details;
TRUNCATE TABLE workout_sessions;
TRUNCATE TABLE workout_plan_exercises;
TRUNCATE TABLE workout_plans;
TRUNCATE TABLE ai_recommendations;
TRUNCATE TABLE body_metrics;
TRUNCATE TABLE schedules;
TRUNCATE TABLE membership_subscriptions;
TRUNCATE TABLE payments;
TRUNCATE TABLE orders;
TRUNCATE TABLE product_packages;
TRUNCATE TABLE exercises;
TRUNCATE TABLE muscle_groups;
TRUNCATE TABLE foods;
TRUNCATE TABLE pt_profiles;

-- ==========================================
-- PT_PROFILES  (PT = user_id 2)
-- ==========================================
INSERT IGNORE INTO pt_profiles (user_id, bio, experience_years, rating) VALUES
(2, 'Certified strength and conditioning coach with 7 years of hands-on experience helping members reach their physique and performance goals.',
 7, 4.90);


-- ==========================================
-- MUSCLE_GROUPS
-- ==========================================
INSERT IGNORE INTO muscle_groups (id, name, description) VALUES
(1, 'Chest',     'Pectoralis major and minor muscles'),
(2, 'Back',      'Latissimus dorsi, trapezius, and rhomboids'),
(3, 'Legs',      'Quadriceps, hamstrings, glutes, and calves'),
(4, 'Shoulders', 'Deltoids and rotator cuff muscles'),
(5, 'Arms',      'Biceps, triceps, and forearms'),
(6, 'Core',      'Abdominals, obliques, and lower back'),
(7, 'Full Body', 'Compound movements engaging multiple muscle groups');


-- ==========================================
-- EXERCISES  (created_by PT = 2 or Admin = 1)
-- ==========================================
INSERT IGNORE INTO exercises (id, title, description, video_url, muscle_group_id, difficulty, duration, created_by, created_at) VALUES
(1,  'Warmup Exercise 1',    'Gentle marching in place to warm up the body.',                                'https://res.cloudinary.com/bucd22r4/video/upload/v1783519878/8017173331047_zjmdja.mp4',     7, 0, 30, 2, CURRENT_TIMESTAMP(6)),
(2,  'Warmup Exercise 2',                'Raise arms overhead while alternating side steps in rhythm.',                                    'https://res.cloudinary.com/bucd22r4/video/upload/v1783520882/8017173395908_lzpx23.mp4',         7, 0, 30, 2, CURRENT_TIMESTAMP(6)),
(3,  'Warmup Exercise 3',     'Lower hips while stepping one leg backward, alternating sides.',                                'https://res.cloudinary.com/bucd22r4/video/upload/v1783521212/8017173637193_ybxuoq.mp4',      3, 0, 30, 2, CURRENT_TIMESTAMP(6)),
(4,  'Warmup Exercise 4',         'Simple low intensity exercise to prepare for a workout.',                        'https://res.cloudinary.com/bucd22r4/video/upload/v1783523875/8017173747145_aqfvrr.mp4',             7, 0, 30, 2, CURRENT_TIMESTAMP(6)),
(5,  'Warmup Exercise 5',    'Easy movement designed to loosen up tight muscles safely.',                                      'https://res.cloudinary.com/bucd22r4/video/upload/v1783524064/8017174522387_i6last.mp4',      7, 0, 30, 2, CURRENT_TIMESTAMP(6)),
(6,  'Warmup Exercise 6',                  'Low-impact movement to elevate core temperature and heart rate.',                                     'https://res.cloudinary.com/bucd22r4/video/upload/v1783524815/8017174582040_veciou.mp4',           7, 0, 30, 2, CURRENT_TIMESTAMP(6)),
(7,  'Warmup Exercise 7',               'Basic exercise to activate target muscles before your workout.',                                                  'https://res.cloudinary.com/bucd22r4/video/upload/v1783524892/8017174806631_ygekab.mp4',        7, 0, 30, 2, CURRENT_TIMESTAMP(6)),
(8,  'Mountain Climbers',  'Drive knees toward the chest alternating from a plank.',                      'https://res.cloudinary.com/bucd22r4/video/upload/v1783527937/8018825646358_nelbm3.mp4',  6, 1, 45, 2, CURRENT_TIMESTAMP(6)),
(9,  'Plank Crunch',        'Bring opposite knee and elbow inward while holding plank.',                              'https://res.cloudinary.com/bucd22r4/video/upload/v1783527957/8018825658035_hlqygj.mp4',          6, 2, 45, 2, CURRENT_TIMESTAMP(6)),
(10, 'Plank Hops',  'Hop both feet forward and backward from a plank.',                                        'https://res.cloudinary.com/bucd22r4/video/upload/v1783527962/8018825676592_lqzlgr.mp4', 6, 1, 45, 2, CURRENT_TIMESTAMP(6));


-- ==========================================
-- PRODUCT_PACKAGES
-- ==========================================
INSERT IGNORE INTO product_packages (id, name, type, price, duration_days, description, is_active) VALUES
(1, '1-Month Gym Membership',   'MEMBERSHIP',      350000.00,  30,  'Full access to gym facilities for 1 month.',                              1),
(2, '3-Month Gym Membership',   'MEMBERSHIP',      900000.00,  90,  'Full access to gym facilities for 3 months. Save 14%.',                   1),
(3, '6-Month Gym Membership',   'MEMBERSHIP',      1600000.00, 180, 'Full access to gym facilities for 6 months.',                             1),
(4, '1-Year Gym Membership',    'MEMBERSHIP',      2800000.00, 365, 'Annual membership with unlimited access and 1 free PT session.',          1),
(5, 'Online Beginner Program',  'ONLINE_WORKOUT',  199000.00,  30,  '30-day beginner program with video guides. Train from home.',             1),
(6, 'Online 12-Week Shred',     'ONLINE_WORKOUT',  499000.00,  84,  '12-week fat-loss program with structured HIIT and nutrition tips.',       1),
(7, 'Online Strength Builder',  'ONLINE_WORKOUT',  599000.00,  90,  '90-day progressive overload strength program for intermediate lifters.',  1),
(8, '1-Month Membership (Old)', 'MEMBERSHIP',      300000.00,  30,  'Legacy pricing tier. No longer sold.',                                    0);


-- ==========================================
-- ORDERS  (user_id 3 = member)
-- ==========================================
INSERT IGNORE INTO orders (id, user_id, package_id, price_paid, payment_status, purchased_at) VALUES
(1, 3, 1, 350000.00,  'PAID',      '2025-01-05 09:15:00'),
(2, 3, 2, 900000.00,  'PAID',      '2025-03-10 14:30:00'),
(3, 3, 5, 199000.00,  'CANCELLED', '2025-05-01 10:00:00'),
(4, 3, 6, 499000.00,  'PAID',      '2025-06-01 11:00:00'),
(5, 3, 1, 350000.00,  'PENDING',   '2025-06-20 08:45:00');


-- ==========================================
-- PAYMENTS
-- ==========================================
INSERT IGNORE INTO payments (order_id, payment_method, transaction_code, amount, status, paid_at) VALUES
(1, 'MOMO',          'MOMO-20250105-001',  350000.00, 'SUCCESS', '2025-01-05 09:17:00'),
(2, 'VNPAY',         'VNP-20250310-002',   900000.00, 'SUCCESS', '2025-03-10 14:33:00'),
(3, 'MOMO',          NULL,                 199000.00, 'FAILED',  NULL),
(4, 'PAYOS',         'PAYOS-20250601-004', 499000.00, 'SUCCESS', '2025-06-01 11:05:00'),
(5, 'BANK_TRANSFER', NULL,                 350000.00, 'PENDING', NULL);


-- ==========================================
-- MEMBERSHIP_SUBSCRIPTIONS
-- ==========================================
INSERT IGNORE INTO membership_subscriptions (user_id, package_id, order_id, start_date, end_date, status) VALUES
(3, 1, 1, '2025-01-05', '2025-02-04', 'EXPIRED'),
(3, 2, 2, '2025-03-10', '2025-06-07', 'EXPIRED'),
(3, 6, 4, '2025-06-01', '2025-08-24', 'ACTIVE');


-- ==========================================
-- BODY_METRICS  (member = user_id 3)
-- ==========================================
INSERT IGNORE INTO body_metrics (user_id, height, weight, body_fat_percentage, muscle_mass, bmi, recorded_at) VALUES
(3, 172.00, 80.00, 22.00, 40.00, 27.04, '2025-01-05 09:30:00'),
(3, 172.00, 78.50, 20.50, 41.00, 26.54, '2025-03-10 10:00:00'),
(3, 172.00, 77.00, 19.00, 42.00, 26.03, '2025-06-01 10:00:00');


-- ==========================================
-- SCHEDULES  (pt_id=2, member_id=3)
-- ==========================================
INSERT IGNORE INTO schedules (pt_id, member_id, start_time, end_time, status) VALUES
(2, 3, '2025-02-10 08:00:00', '2025-02-10 09:00:00', 2),   -- COMPLETED: Initial assessment
(2, 3, '2025-02-17 08:00:00', '2025-02-17 09:00:00', 2),   -- COMPLETED: Upper body push
(2, 3, '2025-02-24 08:00:00', '2025-02-24 09:00:00', 2),   -- COMPLETED: Lower body squat
(2, 3, '2025-03-03 08:00:00', '2025-03-03 09:00:00', 2),   -- COMPLETED: Deadlift online session
(2, 3, '2025-06-23 08:00:00', '2025-06-23 09:00:00', 1),   -- CONFIRMED: Pull day
(2, 3, '2025-06-30 08:00:00', '2025-06-30 09:00:00', 0),   -- PENDING:   Cardio and core
(2, 3, '2025-04-07 08:00:00', '2025-04-07 09:00:00', 3);   -- CANCELLED


-- ==========================================
-- FOODS
-- ==========================================
INSERT IGNORE INTO foods (id, name, serving_size, unit, calories, protein, carbs, fat, image_url) VALUES
(1,  'White Rice',            '100', 'g',     130, 2.70,  28.00, 0.30,  NULL),
(2,  'Brown Rice',            '100', 'g',     112, 2.60,  23.50, 0.90,  NULL),
(3,  'Oatmeal',               '100', 'g',     389, 17.00, 66.00, 7.00,  NULL),
(4,  'Sweet Potato',          '100', 'g',      86, 1.60,  20.00, 0.10,  NULL),
(5,  'Whole Wheat Bread',     '1',   'slice',  69, 3.60,  12.00, 1.10,  NULL),
(6,  'Grilled Chicken Breast', '100', 'g',    165, 31.00, 0.00,  3.60,  NULL),
(7,  'Whole Eggs',            '1',   'piece',  78, 6.00,  0.60,  5.30,  NULL),
(8,  'Baked Salmon',          '100', 'g',     208, 20.00, 0.00,  13.00, NULL),
(9,  'Canned Tuna',           '100', 'g',     116, 26.00, 0.00,  1.00,  NULL),
(10, 'Lean Ground Beef',      '100', 'g',     250, 26.00, 0.00,  15.00, NULL), 
(11, 'Lean Pork Loin',        '100', 'g',     143, 26.00, 0.00,  3.50,  NULL),
(12, 'Steamed Shrimp',        '100', 'g',      99, 24.00, 0.20,  0.30,  NULL), 
(13, 'Whey Protein',          '1',   'scoop', 120, 24.00, 3.00,  1.50,  NULL),
(14, 'Greek Yogurt',          '100', 'g',      59, 10.00, 3.60,  0.40,  NULL),
(15, 'Cottage Cheese',        '100', 'g',      98, 11.00, 3.40,  4.30,  NULL),
(16, 'Whole Milk',            '250', 'ml',    149, 8.00,  12.00, 8.00,  NULL),
(17, 'Avocado',               '100', 'g',     160, 2.00,  9.00,  15.00, NULL),
(18, 'Almonds',               '30',  'g',     174, 6.00,  6.00,  15.00, NULL),
(19, 'Peanut Butter',         '2',   'tbsp',  188, 8.00,  6.00,  16.00, NULL),
(20, 'Olive Oil',             '1',   'tbsp',  119, 0.00,  0.00,  13.50, NULL), 
(21, 'Steamed Broccoli',      '100', 'g',      55, 3.70,  11.00, 0.60,  NULL),
(22, 'Raw Spinach',           '100', 'g',      23, 2.90,  3.60,  0.40,  NULL),
(23, 'Banana',                '1',   'piece', 105, 1.30,  27.00, 0.30,  NULL),
(24, 'Orange',                '1',   'piece',  62, 1.20,  15.40, 0.20,  NULL),
(25, 'Apple',                 '1',   'piece',  95, 0.50,  25.00, 0.30,  NULL), 
(26, 'Tomato',                '100', 'g',      18, 0.90,  3.90,  0.20,  NULL), 
(27, 'Cucumber',              '100', 'g',      15, 0.70,  3.60,  0.10,  NULL), 
(28, 'Asparagus',             '100', 'g',      20, 2.20,  3.80,  0.10,  NULL),
(29, 'White Mushrooms',       '100', 'g',      22, 3.10,  3.30,  0.30,  NULL), 
(30, 'Mixed Salad Greens',    '100', 'g',      15, 1.50,  2.50,  0.20,  NULL); 

-- ==========================================
-- AI_RECOMMENDATIONS  (user_id 3 = member)
-- ==========================================
INSERT IGNORE INTO ai_recommendations (id, user_id, type, user_request, ai_response, created_at) VALUES
(1, 3, 'WORKOUT_PLAN',
 'I want to build muscle and lose fat. I can train 4 days a week.',
 '{"plan_title":"4-Day Body Recomposition","weeks":8,"days":[{"day":"Monday","focus":"Upper Push","exercises":["Bench Press","Overhead Press","Incline Dumbbell Press"]},{"day":"Tuesday","focus":"Lower Body","exercises":["Barbell Squat","Romanian Deadlift","Dumbbell Lunges"]},{"day":"Thursday","focus":"Upper Pull","exercises":["Pull-Up","Bicep Curl","Cable Tricep Pushdown"]},{"day":"Friday","focus":"Cardio & Core","exercises":["HIIT Treadmill Sprint","Battle Ropes","Plank"]}]}',
 '2025-01-06 10:00:00'),
(2, 3, 'NUTRITION_DIET',
 'I want a high-protein meal plan to support fat loss. Around 1900 kcal per day.',
 '{"diet_title":"High-Protein Fat Loss Plan","daily_calories":1900,"protein_target_g":175,"meals":[{"name":"Breakfast","foods":[{"food_name":"Oatmeal","amount":"100g"},{"food_name":"Whole Eggs","amount":"3 pieces"},{"food_name":"Banana","amount":"1 piece"}],"calories":500},{"name":"Lunch","foods":[{"food_name":"Grilled Chicken Breast","amount":"200g"},{"food_name":"Brown Rice","amount":"150g"},{"food_name":"Steamed Broccoli","amount":"100g"}],"calories":580},{"name":"Post-Workout Snack","foods":[{"food_name":"Whey Protein","amount":"1 scoop"},{"food_name":"Banana","amount":"1 piece"}],"calories":225},{"name":"Dinner","foods":[{"food_name":"Baked Salmon","amount":"150g"},{"food_name":"Sweet Potato","amount":"100g"},{"food_name":"Raw Spinach","amount":"100g"}],"calories":420},{"name":"Evening Snack","foods":[{"food_name":"Greek Yogurt","amount":"150g"},{"food_name":"Almonds","amount":"30g"}],"calories":175}]}',
 '2026-03-11 09:00:00'),
(3, 3, 'WORKOUT_PLAN',
 'I feel ready to level up. Can I get a 5-day intermediate hypertrophy program?',
 '{"plan_title":"5-Day Hypertrophy Split","weeks":10,"days":[{"day":"Monday","focus":"Chest & Triceps","exercises":["Barbell Bench Press","Incline Dumbbell Press","Cable Tricep Pushdown"]},{"day":"Tuesday","focus":"Back & Biceps","exercises":["Deadlift","Pull-Up","Dumbbell Bicep Curl"]},{"day":"Wednesday","focus":"Legs","exercises":["Barbell Back Squat","Romanian Deadlift","Dumbbell Lunges"]},{"day":"Thursday","focus":"Shoulders","exercises":["Overhead Press","Hanging Leg Raise"]},{"day":"Friday","focus":"Full Body HIIT","exercises":["HIIT Treadmill Sprint","Battle Ropes","Plank"]}]}',
 '2025-06-02 11:30:00');


-- ==========================================
-- WORKOUT_PLANS
-- ==========================================
INSERT IGNORE INTO workout_plans (id, user_id, ai_recommendation_id, title, goal, target_calories, target_duration_minutes, created_by_ai, created_at) VALUES
(1, 3, 1, '4-Day Body Recomposition', 'Build muscle and lose fat',              450, 60, 1, '2025-01-06 10:05:00'),
(2, 3, 3, '5-Day Hypertrophy Split',  'Maximize muscle size (intermediate)',    500, 75, 1, '2025-06-02 11:35:00'),
(3, 3, NULL,'PT Custom Plan',         'Improve overall strength and technique', 400, 60, 0, '2025-02-10 09:30:00');


-- ==========================================
-- WORKOUT_PLAN_EXERCISES
-- ==========================================
INSERT IGNORE INTO workout_plan_exercises (workout_plan_id, exercise_id, sets, reps, duration_seconds, rest_seconds, exercise_order) VALUES
-- Plan 1: 4-Day Body Recomp
(1, 1,  4, 8,   NULL, 120, 1),   -- Warmup Exercise 1
(1, 2,  3, 10,  NULL, 90,  2),   -- Warmup Exercise 2
(1, 3,  3, 12,  NULL, 90,  3),   -- Warmup Exercise 3
(1, 4,  4, 6,   NULL, 180, 4),   -- Warmup Exercise 4
(1, 5,  3, 10,  NULL, 90,  5),   -- Warmup Exercise 5
(1, 6,  3, 12,  NULL, 60,  6),   -- Warmup Exercise 6
(1, 7,  4, 8,   NULL, 90,  7),   -- Warmup Exercise 7
(1, 8,  3, 12,  NULL, 60,  8),   -- Mountain Climbers
(1, 9,  3, 15,  NULL, 60,  9),   -- Plank Crunch
(1, 10, 4, NULL, 30,  30,  10),  -- Plank Hops
-- Plan 2: 5-Day Hypertrophy
(2, 1,  4, 10,  NULL, 90,  1),
(2, 2,  3, 12,  NULL, 75,  2),
(2, 3,  3, 15,  NULL, 60,  3),
(2, 4,  4, 5,   NULL, 180, 4),
(2, 5,  4, 8,   NULL, 90,  5),
(2, 6,  3, 12,  NULL, 60,  6),
(2, 7,  4, 8,   NULL, 180, 7),
(2, 8,  3, 10,  NULL, 90,  8),
(2, 9,  3, 12,  NULL, 60,  9),
(2, 10, 4, 8,   NULL, 120, 10),
-- Plan 3: PT Custom
(3, 1,  3, 8,   NULL, 180, 1),
(3, 2,  3, 8,   NULL, 120, 2),
(3, 8,  3, 5,   NULL, 180, 3),
(3, 9,  3, NULL, 60,  45,  4);


-- ==========================================
-- WORKOUT_SESSIONS  (user_id 3)
-- ==========================================
INSERT IGNORE INTO workout_sessions (id, user_id, workout_plan_id, total_duration_minutes, total_calories_burned, status, started_at, completed_at) VALUES
(1, 3, 1, 62,  445.00, 'COMPLETED',   '2025-01-10 08:00:00', '2025-01-10 09:02:00'),
(2, 3, 1, 68,  490.00, 'COMPLETED',   '2025-01-13 08:00:00', '2025-01-13 09:08:00'),
(3, 3, 3, 58,  380.00, 'COMPLETED',   '2025-02-10 08:05:00', '2025-02-10 09:03:00'),
(4, 3, 3, 55,  360.00, 'COMPLETED',   '2025-02-17 08:05:00', '2025-02-17 09:00:00'),
(5, 3, 1, 70,  510.00, 'COMPLETED',   '2025-03-15 08:00:00', '2025-03-15 09:10:00'),
(6, 3, 1,  0,    0.00, 'CANCELLED',   '2025-04-01 08:00:00', NULL),
(7, 3, 2, 78,  560.00, 'COMPLETED',   '2025-06-05 07:30:00', '2025-06-05 08:48:00'),
(8, 3, 2, 15,  110.00, 'IN_PROGRESS', '2025-06-22 08:00:00', NULL);


-- ==========================================
-- WORKOUT_SESSION_DETAILS
-- ==========================================
INSERT IGNORE INTO workout_session_details (workout_session_id, exercise_id, sets_done, reps_done, duration_seconds, calories_burned) VALUES
-- Session 1 (Plan 1 - Upper Push + Core)
(1, 1,  4, 8,   NULL,  110.00),
(1, 2,  3, 10,  NULL,   85.00),
(1, 3,  3, 12,  NULL,   55.00),
(1, 10, 3, NULL, 60,    20.00),
-- Session 2 (Plan 1 - Lower Body)
(2, 4,  4, 6,   NULL,  200.00),
(2, 5,  3, 10,  NULL,  120.00),
(2, 6,  3, 12,  NULL,   75.00),
-- Session 3 (PT Custom)
(3, 1,  3, 8,   NULL,  160.00),
(3, 2,  3, 8,   NULL,   95.00),
(3, 8,  3, 5,   NULL,  125.00),
-- Session 4 (PT Custom)
(4, 1,  3, 8,   NULL,  155.00),
(4, 2,  3, 9,   NULL,  100.00),
(4, 9,  3, NULL, 60,    20.00),
-- Session 5 (Plan 1 - Pull + HIIT)
(5, 7,  4, 8,   NULL,  100.00),
(5, 8,  4, NULL, 30,   195.00),
(5, 9,  3, NULL, 45,   175.00),
-- Session 7 (Plan 2 - Chest & Triceps)
(7, 1,  4, 10,  NULL,  115.00),
(7, 2,  3, 12,  NULL,   90.00),
(7, 3,  3, 15,  NULL,   55.00),
-- Session 8 (Plan 2 - in progress, partial)
(8, 4,  2, 5,   NULL,  110.00);


-- ==========================================
-- MEAL_SCHEDULES  (user_id 3)
-- ==========================================
INSERT IGNORE INTO meal_schedules (id, user_id, ai_recommendation_id, schedule_name, eat_time, total_calories_target, created_at) VALUES
(1, 3, 2, 'Breakfast',          '07:00:00', 500, '2026-03-11 09:05:00'),
(2, 3, 2, 'Lunch',              '12:00:00', 580, '2026-03-11 09:05:00'),
(3, 3, 2, 'Post-Workout Snack','16:00:00', 225, '2026-03-11 09:05:00'),
(4, 3, 2, 'Dinner',             '19:00:00', 420, '2026-03-11 09:05:00'),
(5, 3, 2, 'Evening Snack',      '21:00:00', 175, '2026-03-11 09:05:00'),
(6, 3, NULL,'Pre-Workout Meal','07:30:00', 380, '2026-06-02 12:00:00');


-- ==========================================
-- MEAL_SCHEDULE_ITEMS
-- ==========================================
INSERT IGNORE INTO meal_schedule_items (meal_schedule_id, food_id, amount, is_eaten) VALUES
-- Breakfast (Lịch 1)
(1, 3,  '80g',      1),   -- Oatmeal 
(1, 7,  '2 pieces', 1),   -- Whole Eggs 
(1, 23, '1 piece',  1),   -- Banana 

-- Lunch (Lịch 2)
(2, 6,  '150g',     1),   -- Grilled Chicken Breast 
(2, 2,  '150g',     1),   -- Brown Rice 
(2, 21, '100g',     1),   -- Steamed Broccoli 

-- Post-Workout Snack (Lịch 3)
(3, 13, '1 scoop',  1),   -- Whey Protein 
(3, 23, '1 piece',  1),   -- Banana 

-- Dinner (Lịch 4)
(4, 8,  '150g',     0),   -- Baked Salmon 
(4, 4,  '150g',     0),   -- Sweet Potato 
(4, 22, '80g',      0),   -- Raw Spinach 

-- Evening Snack (Lịch 5)
(5, 14, '150g',     0),   -- Greek Yogurt 
(5, 18, '15g',      0),   -- Almonds 

-- Pre-Workout Meal - Custom tự tạo không qua AI (Lịch 6)
(6, 5,  '2 slices', 0),   -- Whole Wheat Bread 
(6, 19, '1 tbsp',   0),   -- Peanut Butter 
(6, 16, '250ml',    0);   -- Whole Milk 
-- ==========================================
-- NOTIFICATIONS
-- ==========================================
INSERT IGNORE INTO notifications (user_id, title, content, type, is_read, created_at) VALUES
(3, 'Welcome to FitnessPro!',        'Your account is ready. Check out your AI workout plan to get started.',              'SYSTEM',     1, '2025-01-05 09:20:00'),
(3, 'First Session Completed',       'Great work finishing your first workout session! Keep it up.',                        'WORKOUT',    1, '2025-01-10 09:05:00'),
(3, 'Membership Active',             'Your 1-month gym membership is now active. Expires on Feb 4, 2025.',                 'MEMBERSHIP', 1, '2025-01-05 09:18:00'),
(3, 'Membership Renewed',            'Your 3-month membership is now active. Expires on Jun 7, 2025.',                     'MEMBERSHIP', 1, '2025-03-10 14:35:00'),
(3, 'Schedule Confirmed',            'Your training session with Huan Luyen Vien on Feb 17 at 8:00 AM is confirmed.',      'SCHEDULE',   1, '2025-02-15 10:00:00'),
(3, 'Payment Successful',            'Payment of 499,000 VND for Online 12-Week Shred was received. Enjoy the program!',  'PAYMENT',    1, '2025-06-01 11:06:00'),
(3, 'New AI Plan Ready',             'Your 5-day hypertrophy split is ready. Head to Workouts to start your first session.','WORKOUT',   1, '2025-06-02 11:36:00'),
(3, 'Upcoming Session Tomorrow',     'Reminder: training session with Huan Luyen Vien tomorrow at 8:00 AM.',               'SCHEDULE',   0, '2025-06-22 08:00:00'),
(3, 'Membership Expiring Soon',      'Your Online 12-Week Shred package expires on Aug 24. Consider renewing early.',      'MEMBERSHIP', 0, '2025-06-20 07:00:00'),
(2, 'New Session Booked',            'Hoi Vien has booked a training session on Jun 23 at 8:00 AM.',                       'SCHEDULE',   1, '2025-06-18 10:00:00'),
(2, 'Pending Upload Request',        'Your exercise upload "Incline Dumbbell Press Tutorial" is pending admin review.',    'SYSTEM',     0, '2025-05-15 14:00:00'),
(1, 'New Exercise Upload Request',   'Huan Luyen Vien submitted "Incline Dumbbell Press Tutorial" for review.',            'SYSTEM',     0, '2025-05-15 14:01:00'),
(1, 'New Order Pending Payment',     'Order #5 from Hoi Vien is awaiting payment confirmation.',                           'PAYMENT',    0, '2025-06-20 08:46:00');


-- ==========================================
-- PT_UPLOAD_REQUESTS  (pt_id=2, admin=1)
-- ==========================================
INSERT IGNORE INTO pt_upload_requests (pt_id, exercise_id, title, description, video_url, status, admin_id, review_note, submitted_at, reviewed_at) VALUES
(2, 1, 'Warmup Exercise 1 Tutorial',
 'Step-by-step guide to proper warmup exercise 1 form, covering setup and range of motion.',
 'https://example.com/uploads/warmup-exercise-1.mp4', 'PENDING', NULL, NULL, '2025-05-15 14:00:00', NULL),

(2, NULL, 'Cable Fly Chest Isolation Guide',
 'Demonstration of cable fly with emphasis on mind-muscle connection and proper arc path.',
 'https://example.com/uploads/cable-fly.mp4', 'APPROVED', 1, 'Good demonstration. Clean form cues. Approved.',
 '2025-02-20 10:00:00', '2025-02-22 09:30:00'),

(2, NULL, 'Jump Rope HIIT Routine',
 '20-minute jump rope HIIT circuit for cardiovascular conditioning.',
 'https://example.com/uploads/jump-rope-hiit.mp4', 'REJECTED', 1, 'Video resolution too low. Please re-upload at minimum 1080p.',
 '2025-04-10 11:00:00', '2025-04-12 14:00:00');


SET FOREIGN_KEY_CHECKS=1;
