import apiClient from '../lib/axios'
import type { DietPlanResponse } from './nutrition'

export interface AIChatRequest {
    sessionId?: number
    message: string
}

export interface AIChatResponse {
    sessionId: number
    message: string
    role: string
    isCompleted: boolean
    dietPlan?: DietPlanResponse
}

export const sendChatMessage = async (message: string, sessionId?: number): Promise<AIChatResponse> => {
    const response = await apiClient.post<AIChatResponse>('/AIChat/send', {
        sessionId,
        message,
    })
    return response.data
}

export const getChatMessages = async (sessionId: number): Promise<AIChatResponse[]> => {
    const response = await apiClient.get<AIChatResponse[]>(`/AIChat/${sessionId}`)
    return response.data
}
