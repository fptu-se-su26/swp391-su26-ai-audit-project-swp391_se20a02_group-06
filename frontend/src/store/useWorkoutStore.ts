import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutFormData, WorkoutPhase, ExerciseCardData } from '../features/workout/types/workout'

export interface WeeklyPlanDay {
    dayIndex: number
    title: string
    goal: string
    targetCalories: number
    targetDurationMinutes: number
    exercises: ExerciseCardData[]
    activePlanId: number | null
    activeSessionId: number | null
}

interface WorkoutState {
    phase: WorkoutPhase
    formData: WorkoutFormData | null
    exercises: ExerciseCardData[]
    activePlanId: number | null
    activeSessionId: number | null
    weeklyPlans: WeeklyPlanDay[]
    currentDayIndex: number
    setPhase: (phase: WorkoutPhase) => void
    setFormData: (data: WorkoutFormData | null) => void
    setExercises: (exercises: ExerciseCardData[]) => void
    setActivePlanId: (id: number | null) => void
    setActiveSessionId: (id: number | null) => void
    setWeeklyPlans: (plans: WeeklyPlanDay[]) => void
    setCurrentDayIndex: (idx: number) => void
    setWeeklyPlanActivePlanId: (dayIdx: number, id: number | null) => void
    setWeeklyPlanActiveSessionId: (dayIdx: number, id: number | null) => void
    markExerciseDone: (index: number) => void
    skipExercise: (index: number) => void
    markWeeklyExerciseDone: (dayIdx: number, index: number) => void
    skipWeeklyExercise: (dayIdx: number, index: number) => void
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
            weeklyPlans: [],
            currentDayIndex: 0,
            setPhase: (phase) => set({ phase }),
            setFormData: (formData) => set({ formData }),
            setExercises: (exercises) => set({ exercises }),
            setActivePlanId: (id) => set({ activePlanId: id }),
            setActiveSessionId: (id) => set({ activeSessionId: id }),
            setWeeklyPlans: (weeklyPlans) => set({ weeklyPlans }),
            setCurrentDayIndex: (currentDayIndex) => set({ currentDayIndex }),
            setWeeklyPlanActivePlanId: (dayIdx, id) => set((state) => ({
                weeklyPlans: state.weeklyPlans.map((d) =>
                    d.dayIndex === dayIdx ? { ...d, activePlanId: id } : d
                )
            })),
            setWeeklyPlanActiveSessionId: (dayIdx, id) => set((state) => ({
                weeklyPlans: state.weeklyPlans.map((d) =>
                    d.dayIndex === dayIdx ? { ...d, activeSessionId: id } : d
                )
            })),
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
            markWeeklyExerciseDone: (dayIdx, index) => set((state) => ({
                weeklyPlans: state.weeklyPlans.map((d) =>
                    d.dayIndex === dayIdx ? {
                        ...d,
                        exercises: d.exercises.map((ex, i) =>
                            i === index ? { ...ex, isDone: true, isSkipped: false } : ex
                        )
                    } : d
                )
            })),
            skipWeeklyExercise: (dayIdx, index) => set((state) => ({
                weeklyPlans: state.weeklyPlans.map((d) =>
                    d.dayIndex === dayIdx ? {
                        ...d,
                        exercises: d.exercises.map((ex, i) =>
                            i === index ? { ...ex, isSkipped: true, isDone: false } : ex
                        )
                    } : d
                )
            })),
            resetWorkout: () => set({ phase: 'intro', formData: null, exercises: [], activePlanId: null, activeSessionId: null, weeklyPlans: [], currentDayIndex: 0 }),
        }),
        {
            name: 'workout-storage',
        }
    )
)
