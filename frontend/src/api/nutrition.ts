import apiClient from '../lib/axios'

export interface DailyNutritionSummary {
    date: string
    caloriesTarget: number
    caloriesConsumed: number
    caloriesBurned: number
    caloriesRemaining: number
    netCalories: number
    protein: MacroSummary
    carbs: MacroSummary
    fat: MacroSummary
    waterTargetGlasses: number
    waterConsumedGlasses: number
    hasBodyMetrics: boolean
    fitnessGoal: string
    waterReminderStartTime?: string
    waterReminderEndTime?: string
}

export interface MacroSummary {
    currentGrams: number
    targetGrams: number
    percentage: number
}

export const getDailySummary = async (date: string): Promise<DailyNutritionSummary> => {
    const response = await apiClient.get(`/nutrition/daily?date=${date}`)
    return response.data
}

export const logWater = async (date: string, glasses: number = 1): Promise<DailyNutritionSummary> => {
    const response = await apiClient.post(`/nutrition/water?date=${date}`, { glasses })
    return response.data
}

export const updateReminderSettings = async (startTime: string, endTime: string): Promise<{ success: boolean }> => {
    const response = await apiClient.put('/nutrition/reminder-settings', { startTime, endTime })
    return response.data
}
