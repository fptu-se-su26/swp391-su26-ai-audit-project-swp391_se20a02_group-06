import apiClient from '../lib/axios'

export interface PTProfile {
    id: number
    fullName: string
    email: string
    avatarUrl: string | null
    bio: string | null
    experienceYears: number | null
    hourlyRate: number | null
    rating: number | null
}

export interface UpdatePTProfilePayload {
    fullName?: string
    bio?: string
    experienceYears?: number
    hourlyRate?: number
    avatarUrl?: string
    currentPassword?: string
    newPassword?: string
}

export const getPTProfile = async (): Promise<PTProfile> => {
    const response = await apiClient.get('/pt/profile')
    return response.data
}

export const updatePTProfile = async (data: UpdatePTProfilePayload): Promise<void> => {
    await apiClient.put('/pt/profile', data)
}

export const changePTPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.put('/pt/profile', {
        currentPassword,
        newPassword,
    })
}
