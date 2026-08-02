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
    injuries: { id: string; severity: number }[]
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
    setsCount?: number
    repsCount?: number
    durationSeconds?: number
    restSeconds?: number
    caloriesBurned?: number
}