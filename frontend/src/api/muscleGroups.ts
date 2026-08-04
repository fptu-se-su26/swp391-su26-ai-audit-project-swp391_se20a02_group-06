import apiClient from '../lib/axios'

export interface MuscleGroup {
    id: number
    name: string
    description?: string
}

export const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
    try {
        const response = await apiClient.get('/muscle-groups')
        return response.data
    } catch (error: any) {
        console.warn("Failed to fetch muscle groups from backend:", error)
        return []
    }
}
