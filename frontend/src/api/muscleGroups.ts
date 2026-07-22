import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5007'

export interface MuscleGroup {
    id: number
    name: string
    description?: string
}

export const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/muscle-groups`)
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch muscle groups')
    }
}
