import apiClient from '../../lib/axios'

export const orderService = {
  purchasePackage: async (packageId: number) => {
    const response = await apiClient.post('/orders/purchase', { packageId })
    return response.data
  },
}
