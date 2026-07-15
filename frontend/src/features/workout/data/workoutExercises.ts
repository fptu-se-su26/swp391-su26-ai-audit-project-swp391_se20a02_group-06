import apiClient from '../../../lib/axios'
import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

export const generateExercises = async (data: WorkoutFormData): Promise<ExerciseCardData[]> => {
    try {
        const response = await apiClient.get('/exercises')
        let allExercises: any[] = response.data

        // Filter by selected muscles if available
        if (data.muscles && data.muscles.length > 0) {
            allExercises = allExercises.filter(ex => 
                data.muscles.some(muscle => ex.muscleGroup?.toLowerCase().includes(muscle.toLowerCase()))
            )
        }
        
        // If filtering leaves us with too few, fallback to all exercises (for safety in demo)
        if (allExercises.length < 3) {
            allExercises = response.data
        }

        const shuffled = allExercises.sort(() => 0.5 - Math.random())

        // Calculate Sets and Rest based on Level
        let sets = 3;
        let restTime = 60; // seconds
        if (data.level === 'Intermediate') {
            sets = 4;
            restTime = 45;
        } else if (data.level === 'Advanced') {
            sets = 5;
            restTime = 30;
        }

        // Calculate Reps and Time per rep based on Goal
        let reps = 12;
        let timePerRep = 3; // seconds
        if (data.goal === 'lose_weight' || data.goal === 'cardio') {
            reps = 16;
            timePerRep = 2; // faster
        } else if (data.goal === 'build_muscle') {
            reps = 8;
            timePerRep = 4; // slower, controlled
        }

        // Time calculation
        const timePerSet = (reps * timePerRep) + restTime; // seconds
        const timePerExercise = timePerSet * sets; // seconds
        const targetDurationSeconds = (data.duration || 30) * 60;
        
        // Calculate number of exercises
        let numExercises = Math.round(targetDurationSeconds / timePerExercise);
        numExercises = Math.max(3, Math.min(numExercises, 12)); // bounds: 3 to 12 exercises

        const selected = shuffled.slice(0, numExercises)

        return selected.map((ex, idx) => {
            const isCardio = ex.muscleGroup?.toLowerCase().includes('cardio') || ex.title?.toLowerCase().includes('jump')
            
            let exSetsStr = `${sets} x ${reps}`
            let exSetsLabel = 'Sets / Reps'
            if (isCardio) {
                const cardioSeconds = reps * timePerRep;
                exSetsStr = `${sets} x ${cardioSeconds}s`
                exSetsLabel = 'Sets / Time'
            }

            const description = ex.description || 'Perform the movement with control. Make sure to engage your core and maintain steady breathing. Inhale as you lower and exhale as you exert force to push up.'
            const fullDescription = `${description}\n\nRest ${restTime} seconds between sets.`

            return {
                id: ex.id,
                index: idx + 1,
                name: ex.title || 'Unknown Exercise',
                tags: ex.muscleGroup ? [ex.muscleGroup] : ['Full Body'],
                sets: exSetsStr,
                setsLabel: exSetsLabel,
                description: fullDescription,
                videoUrl: ex.videoUrl || 'https://www.youtube.com/embed/IODxDxX7oi4',
                imageUrl: ex.thumbnailUrl || (ex.videoUrl?.includes('youtube.com') ? `https://img.youtube.com/vi/${ex.videoUrl.split('embed/')[1]?.split('?')[0]}/0.jpg` : (ex.videoUrl?.includes('cloudinary.com') ? ex.videoUrl.replace(/\.[^/.]+$/, ".jpg") : '')),
                isActive: idx === 0,
                isDone: false,
                isLocked: false
            }
        })
    } catch (error) {
        console.error("Failed to fetch exercises:", error)
        return []
    }
}