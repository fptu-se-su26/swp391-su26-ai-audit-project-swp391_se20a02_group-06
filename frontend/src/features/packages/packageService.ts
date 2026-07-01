import apiClient from '../../lib/axios'

export interface ProductPackage {
  id: number
  name: string
  type: number // Use enum from backend if needed
  price: number
  durationDays: number
  description?: string
}

export const packageService = {
  getAll: async () => {
    const response = await apiClient.get<ProductPackage[]>('/product-packages')
    return response.data
  },
}
