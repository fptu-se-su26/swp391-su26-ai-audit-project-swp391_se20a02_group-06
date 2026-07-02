
-- Seed Muscle Groups
INSERT IGNORE INTO `FitnessProject`.`muscle_groups` (`id`, `name`, `description`) VALUES
(1, 'Chest', 'Pectoral muscles'),
(2, 'Back', 'Latissimus dorsi, rhomboids, trapezius, and lower back'),
(3, 'Legs', 'Quadriceps, hamstrings, glutes, and calves'),
(4, 'Shoulders', 'Deltoid muscles (anterior, lateral, posterior)'),
(5, 'Arms', 'Biceps, triceps, and forearms'),
(6, 'Core', 'Abdominals and obliques');

-- Seed Exercises
INSERT IGNORE INTO `FitnessProject`.`exercises` 
(`title`, `description`, `muscle_group_id`, `difficulty`, `equipment`, `duration_minutes`, `calories_burn_per_min`, `created_by`, `status`) VALUES
-- Chest (Muscle Group 1)
('Barbell Bench Press', 'Lie on a flat bench and press a barbell upwards.', 1, 'INTERMEDIATE', 'Barbell, Bench', 10, 5.0, 1, 'APPROVED'),
('Incline Dumbbell Press', 'Press dumbbells upwards on an incline bench.', 1, 'INTERMEDIATE', 'Dumbbells, Incline Bench', 10, 4.5, 1, 'APPROVED'),
('Push-ups', 'Standard bodyweight push-up targeting the chest.', 1, 'BEGINNER', 'Bodyweight', 5, 4.0, 1, 'APPROVED'),
('Cable Crossovers', 'Pull cables together in front of your chest.', 1, 'INTERMEDIATE', 'Cable Machine', 8, 4.0, 1, 'APPROVED'),
('Chest Flyes', 'Lie on a bench and perform flyes with dumbbells.', 1, 'BEGINNER', 'Dumbbells, Bench', 8, 3.5, 1, 'APPROVED'),

-- Back (Muscle Group 2)
('Deadlift', 'Lift a loaded barbell off the ground to the hips.', 2, 'ADVANCED', 'Barbell', 15, 6.5, 1, 'APPROVED'),
('Pull-ups', 'Pull your body up to a bar.', 2, 'INTERMEDIATE', 'Pull-up Bar', 5, 5.5, 1, 'APPROVED'),
('Barbell Rows', 'Bend over and pull a barbell to your lower chest.', 2, 'INTERMEDIATE', 'Barbell', 10, 5.0, 1, 'APPROVED'),
('Lat Pulldowns', 'Pull the bar down to your chest on a lat machine.', 2, 'BEGINNER', 'Lat Machine', 10, 4.0, 1, 'APPROVED'),
('Seated Cable Rows', 'Pull the cable handle towards your stomach while seated.', 2, 'BEGINNER', 'Cable Machine', 10, 4.0, 1, 'APPROVED'),

-- Legs (Muscle Group 3)
('Barbell Squats', 'Squat down with a barbell across your upper back.', 3, 'INTERMEDIATE', 'Barbell, Squat Rack', 15, 6.0, 1, 'APPROVED'),
('Leg Press', 'Press the platform away with your legs on the machine.', 3, 'BEGINNER', 'Leg Press Machine', 10, 5.0, 1, 'APPROVED'),
('Walking Lunges', 'Step forward into a lunge and repeat walking forward.', 3, 'BEGINNER', 'Bodyweight or Dumbbells', 10, 4.5, 1, 'APPROVED'),
('Leg Extensions', 'Extend your legs upwards on the extension machine.', 3, 'BEGINNER', 'Leg Extension Machine', 8, 3.0, 1, 'APPROVED'),
('Standing Calf Raises', 'Raise your heels off the ground standing.', 3, 'BEGINNER', 'Bodyweight or Machine', 5, 2.5, 1, 'APPROVED'),

-- Shoulders (Muscle Group 4)
('Overhead Press', 'Press a barbell or dumbbells overhead from the shoulders.', 4, 'INTERMEDIATE', 'Barbell or Dumbbells', 10, 4.5, 1, 'APPROVED'),
('Lateral Raises', 'Raise dumbbells out to your sides.', 4, 'BEGINNER', 'Dumbbells', 8, 3.0, 1, 'APPROVED'),
('Front Raises', 'Raise dumbbells straight out in front of you.', 4, 'BEGINNER', 'Dumbbells', 8, 3.0, 1, 'APPROVED'),
('Reverse Pec Deck', 'Pull the machine handles backwards targeting rear delts.', 4, 'BEGINNER', 'Pec Deck Machine', 8, 3.0, 1, 'APPROVED'),
('Arnold Press', 'Dumbbell press with a rotational movement.', 4, 'INTERMEDIATE', 'Dumbbells', 10, 4.0, 1, 'APPROVED'),

-- Arms (Muscle Group 5)
('Barbell Bicep Curls', 'Curl a barbell upwards towards your chest.', 5, 'BEGINNER', 'Barbell', 10, 3.0, 1, 'APPROVED'),
('Tricep Pushdowns', 'Push the cable attachment downwards.', 5, 'BEGINNER', 'Cable Machine', 10, 3.0, 1, 'APPROVED'),
('Hammer Curls', 'Curl dumbbells with a neutral grip.', 5, 'BEGINNER', 'Dumbbells', 8, 3.0, 1, 'APPROVED'),
('Skull Crushers', 'Lower an EZ bar to your forehead while lying down.', 5, 'INTERMEDIATE', 'EZ Bar, Bench', 10, 3.5, 1, 'APPROVED'),
('Concentration Curls', 'Curl a dumbbell while sitting, elbow resting on thigh.', 5, 'BEGINNER', 'Dumbbell', 8, 2.5, 1, 'APPROVED'),

-- Core (Muscle Group 6)
('Crunches', 'Basic abdominal crunch on the floor.', 6, 'BEGINNER', 'Bodyweight', 5, 3.5, 1, 'APPROVED'),
('Plank', 'Hold a push-up position resting on forearms.', 6, 'BEGINNER', 'Bodyweight', 5, 3.0, 1, 'APPROVED'),
('Russian Twists', 'Twist your torso side to side while seated, feet off floor.', 6, 'INTERMEDIATE', 'Bodyweight or Medicine Ball', 5, 4.0, 1, 'APPROVED'),
('Hanging Leg Raises', 'Hang from a bar and raise your legs up.', 6, 'ADVANCED', 'Pull-up Bar', 5, 4.5, 1, 'APPROVED'),
('Bicycle Crunches', 'Alternate bringing elbows to opposite knees.', 6, 'BEGINNER', 'Bodyweight', 5, 4.0, 1, 'APPROVED');
