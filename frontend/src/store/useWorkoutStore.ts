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
        }),
        {
            name: 'workout-storage',
        }
    )
)
