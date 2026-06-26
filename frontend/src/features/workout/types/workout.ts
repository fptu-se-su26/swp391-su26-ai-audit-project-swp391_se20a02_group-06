export type WorkoutPhase = 'intro' | 'setup' | 'loading' | 'results'

export type WorkoutFormData = {
    goal: string
    gender: string
    age: string
    height: string
    weight: string
    level: string
    duration: number
    frequency: number
    equipment: string[]
    muscles: string[]
    targetCalories: number
}

export interface ExerciseCardData {
    index: number
    name: string
    tags: string[]
    sets: string
    setsLabel: string
    isActive?: boolean
    isLocked?: boolean
    isDone?: boolean
}