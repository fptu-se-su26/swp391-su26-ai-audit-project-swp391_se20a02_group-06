import apiClient from '../../../lib/axios'
import { getMuscleGroups } from '../../../api/muscleGroups'
import { generateAiWorkoutPlan, generateAiWeeklyWorkoutPlan } from '../../../api/workouts.ts'
import type { WeeklyPlanDay } from '../../../store/useWorkoutStore.ts'

import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

// Fallback logic in case AI microservice is offline or fails
const getFallbackExercises = async (): Promise<ExerciseCardData[]> => {
    try {
        const response = await apiClient.get('/exercises')
        const allExercises: any[] = response.data
        const shuffled = allExercises.sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, 4)
        return selected.map((ex, idx) => {
            const isCardio = (ex.muscleGroup && typeof ex.muscleGroup === 'string' ? ex.muscleGroup.toLowerCase() : '').includes('cardio') || (ex.title && ex.title.toLowerCase().includes('jump'))
            return {
                id: ex.id,
                index: idx + 1,
                name: ex.title || 'Unknown Exercise',
                tags: ex.muscleGroup ? [ex.muscleGroup] : ['Full Body'],
                sets: isCardio ? '3 x 30s' : '3 x 12',
                setsLabel: isCardio ? 'Sets / Time' : 'Sets / Reps',
                setsCount: 3,
                repsCount: isCardio ? 0 : 12,
                durationSeconds: isCardio ? 30 : 0,
                restSeconds: 60,
                caloriesBurned: 30,
                description: ex.description || 'Perform the movement with control. Make sure to engage your core and maintain steady breathing. Inhale as you lower and exhale as you exert force to push up. Rest 60 seconds between sets.',
                videoUrl: ex.videoUrl || 'https://www.youtube.com/embed/IODxDxX7oi4',
                imageUrl: ex.thumbnailUrl || 'https://img.youtube.com/vi/IODxDxX7oi4/0.jpg',
                isActive: idx === 0,
                isDone: false,
                isLocked: false
            }
        })
    } catch (e) {
        console.error("Failed to fetch fallback exercises:", e)
        return []
    }
}

export const generateExercises = async (data: WorkoutFormData): Promise<ExerciseCardData[]> => {
    try {
        // 1. Fetch muscle groups to map target muscle ID to name
        const apiMuscles = await getMuscleGroups()
        let muscleGroup = 'Chest'
        if (data.muscles && data.muscles.length > 0) {
            const muscleNames = data.muscles.map(mId => {
                const found = apiMuscles.find(
                    (m) => m.id.toString() === mId || m.name.toLowerCase() === mId.toLowerCase()
                )
                return found ? found.name : mId
            })
            muscleGroup = muscleNames.join(', ')
        }

        let injuredMuscleGroups: string | undefined = undefined
        if (data.injuries && data.injuries.length > 0) {
            const injuredNames = data.injuries.map(injury => {
                const found = apiMuscles.find(
                    (m) => m.id.toString() === injury.id || m.name.toLowerCase() === injury.id.toLowerCase()
                )
                const name = found ? found.name : injury.id
                return `${name} (Mức độ ${injury.severity}/5)`
            })
            injuredMuscleGroups = injuredNames.join(', ')
        }

        // 2. Fetch all exercises from DB (to join details) and call AI in parallel
        const [exercisesResponse, aiResponse] = await Promise.all([
            apiClient.get('/exercises'),
            generateAiWorkoutPlan({
                muscleGroup,
                injuredMuscleGroups,
                targetCalories: data.targetCalories,
                durationMinutes: data.duration
            })
        ])

        const allExercises: any[] = exercisesResponse.data
        const aiWorkoutPlan = aiResponse.recommendation

        if (!aiWorkoutPlan || !aiWorkoutPlan.exercises || aiWorkoutPlan.exercises.length === 0) {
            throw new Error("No exercises returned from AI model.")
        }

        return aiWorkoutPlan.exercises.map((aiEx: any, idx) => {
            const exerciseId = aiEx.exerciseId ?? aiEx.exercise_id
            const exerciseTitle = aiEx.exerciseTitle ?? aiEx.exercise_title
            const durationSeconds = aiEx.durationSeconds ?? aiEx.duration_seconds
            const restSeconds = aiEx.restSeconds ?? aiEx.rest_seconds
            const caloriesBurned = aiEx.caloriesBurned ?? aiEx.calories_burned

            // Find DB details
            const dbEx = allExercises.find((ex: any) => ex.id === exerciseId)
            
            // Format sets and reps
            let setsStr = `${aiEx.sets} x ${aiEx.reps}`
            let setsLabelStr = 'Sets / Reps'
            if (durationSeconds > 0) {
                setsStr = `${aiEx.sets} x ${durationSeconds}s`
                setsLabelStr = 'Sets / Time'
            }

            const muscleGroupName = dbEx?.muscleGroup || muscleGroup

            return {
                id: exerciseId,
                index: idx + 1,
                name: exerciseTitle || dbEx?.title || 'Unknown Exercise',
                tags: muscleGroupName ? [muscleGroupName] : ['Full Body'],
                sets: setsStr,
                setsLabel: setsLabelStr,
                setsCount: aiEx.sets,
                repsCount: aiEx.reps,
                durationSeconds: durationSeconds,
                restSeconds: restSeconds,
                caloriesBurned: caloriesBurned,
                description: dbEx?.description || `Perform the movement with control. Rest ${restSeconds} seconds between sets.`,
                videoUrl: dbEx?.videoUrl || '',
                imageUrl: dbEx?.thumbnailUrl || (dbEx?.videoUrl && dbEx.videoUrl.includes('cloudinary.com') ? dbEx.videoUrl.replace('/video/upload/', '/video/upload/so_0,w_400,h_300,c_fill,f_jpg/').replace(/\.[^.]+$/, '.jpg') : ''),
                isActive: idx === 0,
                isDone: false,
                isLocked: false
            }
        })
    } catch (error) {
        console.warn("Failed to generate AI exercises, falling back to random:", error)
        return getFallbackExercises()
    }
}

export const generateWeeklyExercises = async (data: WorkoutFormData): Promise<WeeklyPlanDay[]> => {
    try {
        const apiMuscles = await getMuscleGroups()
        let muscleGroup = 'Split'
        if (data.muscles && data.muscles.length > 0) {
            const muscleNames = data.muscles.map(mId => {
                const found = apiMuscles.find(
                    (m) => m.id.toString() === mId || m.name.toLowerCase() === mId.toLowerCase()
                )
                return found ? found.name : mId
            })
            muscleGroup = muscleNames.join(', ')
        }

        let injuredMuscleGroups: string | undefined = undefined
        if (data.injuries && data.injuries.length > 0) {
            const injuredNames = data.injuries.map(injury => {
                const found = apiMuscles.find(
                    (m) => m.id.toString() === injury.id || m.name.toLowerCase() === injury.id.toLowerCase()
                )
                const name = found ? found.name : injury.id
                return `${name} (Mức độ ${injury.severity}/5)`
            })
            injuredMuscleGroups = injuredNames.join(', ')
        }

        const [exercisesResponse, aiResponse] = await Promise.all([
            apiClient.get('/exercises'),
            generateAiWeeklyWorkoutPlan({
                muscleGroup,
                injuredMuscleGroups,
                targetCaloriesPerDay: data.targetCalories,
                durationMinutesPerDay: data.duration,
                frequency: data.frequency
            })
        ])

        const allExercises: any[] = exercisesResponse.data
        const weeklyDays = aiResponse.recommendation.days

        if (!weeklyDays || weeklyDays.length === 0) {
            throw new Error("No weekly days returned from AI model.")
        }

        return weeklyDays.map((dayPlan, dayIdx) => {
            const exercises: ExerciseCardData[] = dayPlan.exercises.map((aiEx: any, idx) => {
                const exerciseId = aiEx.exerciseId ?? aiEx.exercise_id
                const exerciseTitle = aiEx.exerciseTitle ?? aiEx.exercise_title
                const durationSeconds = aiEx.durationSeconds ?? aiEx.duration_seconds
                const restSeconds = aiEx.restSeconds ?? aiEx.rest_seconds
                const caloriesBurned = aiEx.caloriesBurned ?? aiEx.calories_burned

                const dbEx = allExercises.find((ex: any) => ex.id === exerciseId)
                let setsStr = `${aiEx.sets} x ${aiEx.reps}`
                let setsLabelStr = 'Sets / Reps'
                if (durationSeconds > 0) {
                    setsStr = `${aiEx.sets} x ${durationSeconds}s`
                    setsLabelStr = 'Sets / Time'
                }
                const muscleGroupName = dbEx?.muscleGroup || muscleGroup

                return {
                    id: exerciseId,
                    index: idx + 1,
                    name: exerciseTitle || dbEx?.title || 'Unknown Exercise',
                    tags: muscleGroupName ? [muscleGroupName] : ['Full Body'],
                    sets: setsStr,
                    setsLabel: setsLabelStr,
                    setsCount: aiEx.sets,
                    repsCount: aiEx.reps,
                    durationSeconds: durationSeconds,
                    restSeconds: restSeconds,
                    caloriesBurned: caloriesBurned,
                    description: dbEx?.description || `Perform the movement with control. Rest ${restSeconds} seconds between sets.`,
                    videoUrl: dbEx?.videoUrl || '',
                    imageUrl: dbEx?.thumbnailUrl || (dbEx?.videoUrl && dbEx.videoUrl.includes('cloudinary.com') ? dbEx.videoUrl.replace('/video/upload/', '/video/upload/so_0,w_400,h_300,c_fill,f_jpg/').replace(/\.[^.]+$/, '.jpg') : ''),
                    isActive: idx === 0,
                    isDone: false,
                    isLocked: false
                }
            })

            return {
                dayIndex: dayIdx,
                title: dayPlan.title || `Day ${dayIdx + 1}`,
                goal: dayPlan.goal || data.goal || 'Workout Session',
                targetCalories: dayPlan.targetCalories || data.targetCalories,
                targetDurationMinutes: dayPlan.targetDurationMinutes || data.duration,
                exercises,
                activePlanId: null,
                activeSessionId: null
            }
        })

    } catch (error) {
        console.warn("Failed to generate AI weekly exercises, falling back:", error)
        const fallbackDays: WeeklyPlanDay[] = []
        for (let i = 0; i < data.frequency; i++) {
            const exercises = await getFallbackExercises()
            fallbackDays.push({
                dayIndex: i,
                title: `Day ${i + 1} — Fallback Plan`,
                goal: data.goal || 'General Health',
                targetCalories: data.targetCalories,
                targetDurationMinutes: data.duration,
                exercises,
                activePlanId: null,
                activeSessionId: null
            })
        }
        return fallbackDays
    }
}