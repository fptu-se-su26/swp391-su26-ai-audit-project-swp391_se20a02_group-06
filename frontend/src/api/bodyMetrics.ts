import axiosInstance from '../lib/axios'

export interface BodyMetric {
    id: number
    userId: number
    height?: number
    weight: number
    bodyFatPercentage?: number
    muscleMass?: number
    bmi?: number
    recordedAt: string
}

export const getLatestBodyMetric = async (): Promise<BodyMetric | null> => {
    try {
        const response = await axiosInstance.get('/BodyMetrics/latest')
        return response.data
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null
        }
        throw error
    }
}

export const addBodyMetric = async (data: { age?: number, gender?: string, height?: number, weight: number }): Promise<BodyMetric> => {
    // calculate bmi roughly if height and weight exist
    let bmi
    if (data.height && data.weight) {
        bmi = data.weight / Math.pow(data.height / 100, 2)
    }

    const payload = {
        ...data,
        bmi
    }
    
    const response = await axiosInstance.post('/BodyMetrics', payload)
    return response.data
}
