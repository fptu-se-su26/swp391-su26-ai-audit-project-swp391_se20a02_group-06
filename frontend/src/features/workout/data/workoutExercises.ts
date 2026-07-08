import apiClient from '../../../lib/axios'
import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

export const generateExercises = async (data: WorkoutFormData): Promise<ExerciseCardData[]> => {
    const bank: Record<string, Omit<ExerciseCardData, 'id'>[]> = {
        lose_weight: [
            { index: 1, name: 'Jump Squat', tags: ['Chân', 'Cardio'], sets: '4 x 15', setsLabel: 'Sets / Reps', isDone: true },
            { index: 2, name: 'Burpees', tags: ['Toàn thân'], sets: '3 x 12', setsLabel: 'Sets / Reps', isActive: true },
            { index: 3, name: 'Mountain Climbers', tags: ['Bụng', 'Cardio'], sets: '3 x 30s', setsLabel: 'Sets / Time' },
            { index: 4, name: 'High Knees Sprint', tags: ['Cardio'], sets: '3 x 45s', setsLabel: 'Sets / Time' },
        ],
        build_muscle: [
            { index: 1, name: 'Barbell Back Squat', tags: ['Chân', 'Compound'], sets: '4 x 8', setsLabel: 'Sets / Reps', isDone: true },
            { index: 2, name: 'Romanian Deadlift', tags: ['Hamstrings'], sets: '4 x 10', setsLabel: 'Sets / Reps', isActive: true },
            { index: 3, name: 'Bulgarian Split Squat', tags: ['Quads', 'Mông'], sets: '3 x 12', setsLabel: 'Per Leg' },
            { index: 4, name: 'Advanced Leg Press', tags: ['Quads', 'Glutes'], sets: '–', setsLabel: 'Locked', isLocked: true },
        ],
        stay_active: [
            { index: 1, name: 'Bodyweight Squat', tags: ['Chân'], sets: '3 x 20', setsLabel: 'Sets / Reps', isDone: true },
            { index: 2, name: 'Push-up', tags: ['Ngực', 'Tay'], sets: '3 x 15', setsLabel: 'Sets / Reps', isActive: true },
            { index: 3, name: 'Plank Hold', tags: ['Bụng'], sets: '3 x 45s', setsLabel: 'Sets / Time' },
            { index: 4, name: 'Glute Bridge', tags: ['Mông'], sets: '3 x 20', setsLabel: 'Sets / Reps' },
        ],
        endurance: [
            { index: 1, name: 'Jump Rope', tags: ['Cardio'], sets: '5 x 1min', setsLabel: 'Sets / Time', isDone: true },
            { index: 2, name: 'Box Step Up', tags: ['Chân', 'Cardio'], sets: '4 x 20', setsLabel: 'Sets / Reps', isActive: true },
            { index: 3, name: 'Bicycle Crunch', tags: ['Bụng'], sets: '3 x 30', setsLabel: 'Sets / Reps' },
            { index: 4, name: 'Bear Crawl', tags: ['Toàn thân'], sets: '3 x 20m', setsLabel: 'Sets / Dist.' },
        ],
        health: [
            { index: 1, name: 'Walking Lunge', tags: ['Chân'], sets: '3 x 12', setsLabel: 'Per Leg', isDone: true },
            { index: 2, name: 'Dumbbell Row', tags: ['Lưng', 'Tay'], sets: '3 x 12', setsLabel: 'Sets / Reps', isActive: true },
            { index: 3, name: 'Superman Hold', tags: ['Lưng dưới'], sets: '3 x 15', setsLabel: 'Sets / Reps' },
            { index: 4, name: 'Side Plank', tags: ['Core'], sets: '2 x 30s', setsLabel: 'Per Side' },
        ],
        performance: [
            { index: 1, name: 'Power Clean', tags: ['Toàn thân', 'Olympic'], sets: '4 x 5', setsLabel: 'Sets / Reps', isDone: true },
            { index: 2, name: 'Box Jump', tags: ['Chân', 'Explosive'], sets: '4 x 8', setsLabel: 'Sets / Reps', isActive: true },
            { index: 3, name: 'Sled Push', tags: ['Toàn thân'], sets: '3 x 20m', setsLabel: 'Sets / Dist.' },
            { index: 4, name: 'Velocity Band Sprint', tags: ['Premium'], sets: '–', setsLabel: 'Locked', isLocked: true },
        ],
    }

    const base = bank[data.goal] ?? bank['build_muscle']
    const baseWithIds = base.map((ex, idx) => ({ ...ex, id: idx + 1 })) as ExerciseCardData[]

    if (data.level === 'Beginner') {
        return baseWithIds.slice(0, 3).map((ex) => ({ ...ex, sets: ex.sets.replace('4', '3').replace('5', '3') }))
    }
    if (data.level === 'Advanced') {
        return baseWithIds.map((ex) => ({ ...ex, isLocked: false, sets: ex.isLocked ? '5 x 10' : ex.sets }))
    }
    return baseWithIds
}