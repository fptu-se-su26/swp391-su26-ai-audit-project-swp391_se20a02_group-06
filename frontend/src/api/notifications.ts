import apiClient from '../lib/axios'

export interface NotificationDto {
    id: number
    userId: number
    title: string
    content: string
    type?: string // EXERCISE_REQUEST, EXERCISE_SUBMISSION, EXERCISE_APPROVAL, EXERCISE_REJECTION, DEADLINE_APPROACHING, WATER_REMINDER
    isRead: boolean
    createdAt: string
}

export const getNotifications = async (): Promise<NotificationDto[]> => {
    const response = await apiClient.get('/notifications')
    return response.data
}

export const markAsRead = async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.put(`/notifications/${id}/read`)
    return response.data
}

export const markAllAsRead = async (): Promise<{ success: boolean }> => {
    const response = await apiClient.put('/notifications/read-all')
    return response.data
}

export const triggerTestWaterReminder = async (): Promise<NotificationDto> => {
    const response = await apiClient.post('/notifications/test-water-reminder')
    return response.data
}
