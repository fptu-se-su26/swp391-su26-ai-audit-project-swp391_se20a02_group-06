import apiClient from '../lib/axios'

export interface CreateExerciseRequestDto {
    ptId: number
    muscleGroup?: string
    difficulty: number // 0=Beginner, 1=Intermediate, 2=Advanced
    instructions?: string
    priority: string // LOW, MEDIUM, HIGH
    deadline?: string
}

export interface PtSubmitExerciseDto {
    title: string
    description?: string
    videoUrl: string
    duration?: number
}

export interface ReviewExerciseRequestDto {
    status: string // APPROVED, REJECTED
    reviewNote?: string
}

export interface ExerciseRequestDto {
    id: number
    ptId: number
    ptName: string
    exerciseId?: number
    exerciseTitle?: string
    title?: string
    description?: string
    videoUrl?: string
    status?: string // PENDING, SUBMITTED, APPROVED, REJECTED
    adminId?: number
    adminName?: string
    reviewNote?: string
    submittedAt?: string
    reviewedAt?: string
    requestedBy?: number
    requestedByName?: string
    muscleGroup?: string
    difficulty?: number
    instructions?: string
    priority?: string
    deadline?: string
    duration?: number
}

export const createExerciseRequest = async (data: CreateExerciseRequestDto): Promise<ExerciseRequestDto> => {
    const response = await apiClient.post('/exercise-requests', data)
    return response.data
}

export const getAllExerciseRequests = async (): Promise<ExerciseRequestDto[]> => {
    const response = await apiClient.get('/exercise-requests')
    return response.data
}

export const getMyExerciseRequests = async (): Promise<ExerciseRequestDto[]> => {
    const response = await apiClient.get('/exercise-requests/my')
    return response.data
}

export const submitExercise = async (id: number, data: PtSubmitExerciseDto): Promise<ExerciseRequestDto> => {
    const response = await apiClient.put(`/exercise-requests/${id}/submit`, data)
    return response.data
}

export const reviewExerciseRequest = async (id: number, data: ReviewExerciseRequestDto): Promise<ExerciseRequestDto> => {
    const response = await apiClient.put(`/exercise-requests/${id}/review`, data)
    return response.data
}
