import apiClient from '../../../lib/axios'
import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

export const generateExercises = async (data: WorkoutFormData): Promise<ExerciseCardData[]> => {
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
                index: idx + 1,
                name: ex.title || 'Unknown Exercise',
                tags: ex.muscleGroup ? [ex.muscleGroup] : ['Toàn thân'],
                sets: isCardio ? '3 x 30s' : '3 x 12',
                setsLabel: isCardio ? 'Sets / Time' : 'Sets / Reps',
                description: ex.description || 'Thực hiện động tác có kiểm soát. Hãy chắc chắn rằng bạn đang gồng cơ cốt lõi (core) và duy trì nhịp thở đều đặn. Hít vào khi hạ xuống và thở ra khi dùng lực đẩy lên. Nghỉ 60 giây giữa các hiệp.',
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