import apiClient from '../../lib/axios'

export const orderService = {
  purchasePackage: async (packageId: number, returnUrl?: string, cancelUrl?: string) => {
    const response = await apiClient.post('/orders/purchase', { packageId, returnUrl, cancelUrl })
    return response.data
  },
}
