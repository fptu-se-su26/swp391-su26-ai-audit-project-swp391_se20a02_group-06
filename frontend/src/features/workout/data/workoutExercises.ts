import apiClient from '../../../lib/axios'
import { getMuscleGroups } from '../../../api/muscleGroups'
import { generateAiWorkoutPlan, generateAiWeeklyWorkoutPlan } from '../../../api/workouts.ts'
import type { WeeklyPlanDay } from '../../../store/useWorkoutStore.ts'

import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

// AI fallback logic removed as requested

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
            
            if (!dbEx) {
                console.warn(`AI hallucinated an exercise not in DB: ${exerciseTitle} (ID: ${exerciseId}). Filtering it out.`)
                return undefined
            }
            
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
        }).filter(Boolean) as ExerciseCardData[]
    } catch (error) {
        console.error("Failed to generate AI exercises:", error)
        throw error
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
                
                if (!dbEx) {
                    console.warn(`AI hallucinated an exercise not in DB: ${exerciseTitle} (ID: ${exerciseId}). Filtering it out.`)
                    return undefined
                }
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
            }).filter(Boolean) as ExerciseCardData[]

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
        console.error("Failed to generate AI weekly exercises:", error)
        throw error
    }
}