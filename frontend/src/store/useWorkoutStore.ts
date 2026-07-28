import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutFormData, WorkoutPhase, ExerciseCardData } from '../features/workout/types/workout'

interface WorkoutState {
    phase: WorkoutPhase
    formData: WorkoutFormData | null
    exercises: ExerciseCardData[]
    activePlanId: number | null
    activeSessionId: number | null
    setPhase: (phase: WorkoutPhase) => void
    setFormData: (data: WorkoutFormData | null) => void
    setExercises: (exercises: ExerciseCardData[]) => void
    setActivePlanId: (id: number | null) => void
    setActiveSessionId: (id: number | null) => void
    markExerciseDone: (index: number) => void
    skipExercise: (index: number) => void
    resetWorkout: () => void
    
    // BỔ SUNG ĐỊNH NGHĨA PHƯƠNG THỨC ASYNC TẠI ĐÂY
    startWorkoutSession: (payload: { workoutPlanId: number }) => Promise<{ id: number }>
    completeWorkoutSession: (
        sessionId: number, 
        payload: {
            totalDurationMinutes: number
            totalCaloriesBurned: number
            details: Array<{
                exerciseId: string | number
                setsDone: number
                repsDone: number
                durationSeconds: number
                caloriesBurned: number
            }>
        }
    ) => Promise<void>
}

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set) => ({
            phase: 'intro',
            formData: null,
            exercises: [],
            activePlanId: null,
            activeSessionId: null,
            setPhase: (phase) => set({ phase }),
            setFormData: (formData) => set({ formData }),
            setExercises: (exercises) => set({ exercises }),
            setActivePlanId: (id) => set({ activePlanId: id }),
            setActiveSessionId: (id) => set({ activeSessionId: id }),
            markExerciseDone: (index) => set((state) => ({
                exercises: state.exercises.map((ex, i) => 
                    i === index ? { ...ex, isDone: true, isSkipped: false } : ex
                )
            })),
            skipExercise: (index) => set((state) => ({
                exercises: state.exercises.map((ex, i) => 
                    i === index ? { ...ex, isSkipped: true, isDone: false } : ex
                )
            })),
            resetWorkout: () => set({ phase: 'intro', formData: null, exercises: [], activePlanId: null, activeSessionId: null }),

            startWorkoutSession: async (payload) => {
                const { startWorkoutSession: apiStartWorkoutSession } = await import('../api/workouts.ts')
                const res = await apiStartWorkoutSession(payload)
                return { id: res.id }
            },

            completeWorkoutSession: async (sessionId, payload) => {
                const { completeWorkoutSession: apiCompleteWorkoutSession } = await import('../api/workouts.ts')
                await apiCompleteWorkoutSession(sessionId, payload)
                console.log(`Saved Session ${sessionId} successfully:`, payload)
                set({ activeSessionId: null })
            }
        }),
        {
            name: 'workout-storage',
        }
    )
)