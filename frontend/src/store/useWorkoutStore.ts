import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutFormData, WorkoutPhase, ExerciseCardData } from '../features/workout/types/workout'

interface WorkoutState {
    phase: WorkoutPhase
    formData: WorkoutFormData | null
    exercises: ExerciseCardData[]
    setPhase: (phase: WorkoutPhase) => void
    setFormData: (data: WorkoutFormData | null) => void
    setExercises: (exercises: ExerciseCardData[]) => void
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
            setPhase: (phase) => set({ phase }),
            setFormData: (formData) => set({ formData }),
            setExercises: (exercises) => set({ exercises }),
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
            resetWorkout: () => set({ phase: 'intro', formData: null, exercises: [] }),
        }),
        {
            name: 'workout-storage',
        }
    )
)
