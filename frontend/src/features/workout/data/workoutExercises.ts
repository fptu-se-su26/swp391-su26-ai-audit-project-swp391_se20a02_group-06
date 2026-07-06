import apiClient from '../../../lib/axios'
import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

export const generateExercises = async (_data: WorkoutFormData): Promise<ExerciseCardData[]> => {
    try {
        const response = await apiClient.get('/exercises')
        const allExercises: any[] = response.data

        // Sort or randomize slightly to get variety. For now, we just pick a subset.
        // Or if you have logic based on data.goal / data.level, apply here.
        const shuffled = allExercises.sort(() => 0.5 - Math.random())
        
        // Pick top 4 exercises for the phase
        const selected = shuffled.slice(0, 4)

        return selected.map((ex, idx) => {
            const isCardio = ex.muscleGroup?.toLowerCase().includes('cardio') || ex.title?.toLowerCase().includes('jump')
            return {
                id: ex.id,
                index: idx + 1,
                name: ex.title || 'Unknown Exercise',
                tags: ex.muscleGroup ? [ex.muscleGroup] : ['Full Body'],
                sets: isCardio ? '3 x 30s' : '3 x 12',
                setsLabel: isCardio ? 'Sets / Time' : 'Sets / Reps',
                description: ex.description || 'Perform the movement with control. Make sure to engage your core and maintain steady breathing. Inhale as you lower and exhale as you exert force to push up. Rest 60 seconds between sets.',
                videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4', // Mock video URL
                imageUrl: ex.thumbnailUrl || 'https://img.youtube.com/vi/IODxDxX7oi4/0.jpg', // Mock image URL
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