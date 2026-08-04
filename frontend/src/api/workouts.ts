import apiClient from '../lib/axios'

export interface CreateWorkoutPlanDto {
    title: string
    goal?: string
    targetCalories?: number
    targetDurationMinutes?: number
    exercises: CreateWorkoutPlanExerciseDto[]
}

export interface CreateWorkoutPlanExerciseDto {
    exerciseId: number
    sets?: number
    reps?: number
    durationSeconds?: number
    restSeconds?: number
    exerciseOrder?: number
}

export interface WorkoutPlanDto {
    id: number
    userId: number
    title: string
    goal?: string
    targetCalories?: number
    targetDurationMinutes?: number
    createdAt?: string
}

export interface CreateWorkoutSessionDto {
    workoutPlanId?: number
}

export interface CompleteWorkoutSessionDto {
    totalDurationMinutes: number
    totalCaloriesBurned: number
    details: WorkoutSessionDetailDto[]
}

export interface WorkoutSessionDto {
    id: number
    userId: number
    workoutPlanId?: number
    totalDurationMinutes?: number
    totalCaloriesBurned?: number
    status: string
    startedAt?: string
    completedAt?: string
    details: WorkoutSessionDetailDto[]
}

export interface WorkoutSessionDetailDto {
    exerciseId: number
    exerciseName?: string
    setsDone?: number
    repsDone?: number
    durationSeconds?: number
    caloriesBurned?: number
}

export const createWorkoutPlan = async (data: CreateWorkoutPlanDto): Promise<WorkoutPlanDto> => {
    const response = await apiClient.post('/workouts/plans', data)
    return response.data
}

export const startWorkoutSession = async (data: CreateWorkoutSessionDto): Promise<WorkoutSessionDto> => {
    const response = await apiClient.post('/workouts/sessions', data)
    return response.data
}

export const completeWorkoutSession = async (sessionId: number, data: CompleteWorkoutSessionDto): Promise<WorkoutSessionDto> => {
    const response = await apiClient.put(`/workouts/sessions/${sessionId}/complete`, data)
    return response.data
}

export const getWorkoutHistory = async (): Promise<WorkoutSessionDto[]> => {
    const response = await apiClient.get('/workouts/history')
    return response.data
}

export interface AiWorkoutPlanRequestDto {
    muscleGroup: string
    injuredMuscleGroups?: string
    targetCalories: number
    durationMinutes: number
}

export interface AiWorkoutPlanResponseDto {
    success: boolean
    userId: number
    model: string
    recommendation: AiWorkoutPlanOutputDto
}

export interface AiWorkoutPlanOutputDto {
    title: string
    goal: string
    targetCalories: number
    targetDurationMinutes: number
    exercises: AiExerciseItemOutputDto[]
}

export interface AiExerciseItemOutputDto {
    exerciseId: number
    exerciseTitle: string
    sets: number
    reps: number
    durationSeconds: number
    restSeconds: number
    exerciseOrder: number
    caloriesBurned: number
}

export const generateAiWorkoutPlan = async (data: AiWorkoutPlanRequestDto): Promise<AiWorkoutPlanResponseDto> => {
    const response = await apiClient.post('/workouts/ai-generate', data)
    return response.data
}

export interface AiWeeklyWorkoutPlanRequestDto {
    muscleGroup: string
    injuredMuscleGroups?: string
    targetCaloriesPerDay: number
    durationMinutesPerDay: number
    frequency: number
}

export interface AiWeeklyWorkoutPlanResponseDto {
    success: boolean
    userId: number
    model: string
    recommendation: {
        days: AiWorkoutPlanOutputDto[]
    }
}

export const generateAiWeeklyWorkoutPlan = async (data: AiWeeklyWorkoutPlanRequestDto): Promise<AiWeeklyWorkoutPlanResponseDto> => {
    const response = await apiClient.post('/workouts/ai-generate-weekly', data)
    return response.data
}

export interface WeeklyAccessDto {
    hasAccess: boolean
    requiredPackageName?: string | null
}

export const getWeeklyPlanAccess = async (): Promise<WeeklyAccessDto> => {
    const response = await apiClient.get<WeeklyAccessDto>('/workouts/weekly-access')
    return response.data
}
