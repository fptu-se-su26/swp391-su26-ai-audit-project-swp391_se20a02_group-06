import apiClient from '../lib/axios'

export interface ProductPackage {
    id: number
    name: string
    type: number
    price: number
    durationDays: number
    description: string
    isActive: boolean
    isPopular: boolean
    tier: number
}

export const getProductPackages = async (): Promise<ProductPackage[]> => {
    try {
        const response = await apiClient.get(`/product-packages`)
        return response.data
    } catch (error) {
        console.error("Failed to fetch product packages", error)
        return []
    }
}
