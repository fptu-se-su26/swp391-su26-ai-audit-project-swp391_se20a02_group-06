export type WorkoutPhase = 'intro' | 'setup' | 'loading' | 'results'

export type WorkoutFormData = {
    planType: 'daily' | 'weekly'
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
    id: number
    index: number
    name: string
    tags: string[]
    sets: string
    setsLabel: string
    description?: string
    videoUrl?: string
    imageUrl?: string
    isActive?: boolean
    isLocked?: boolean
    isDone?: boolean
    isSkipped?: boolean
    isWarmup?: boolean
    duration?: number
    breakTime?: number
}