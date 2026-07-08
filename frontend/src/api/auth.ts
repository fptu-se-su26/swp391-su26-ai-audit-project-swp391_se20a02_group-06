import apiClient from '../lib/axios'

export interface SendOTPPayload {
    email: string
}

export interface VerifyOTPPayload {
    email: string
    otpCode: string
}

export interface ResetPasswordPayload {
    email: string
    otpCode: string
    newPassword: string
}

export const authApi = {
    sendRegisterOTP: async (payload: SendOTPPayload) => {
        const response = await apiClient.post('/auth/send-register-otp', payload)
        return response.data
    },

    verifyRegisterOTP: async (payload: VerifyOTPPayload) => {
        const response = await apiClient.post('/auth/verify-register-otp', payload)
        return response.data
    },

    sendForgotPasswordOTP: async (payload: SendOTPPayload) => {
        const response = await apiClient.post('/auth/send-forgot-password-otp', payload)
        return response.data
    },

    verifyForgotPasswordOTP: async (payload: VerifyOTPPayload) => {
        const response = await apiClient.post('/auth/verify-forgot-password-otp', payload)
        return response.data
    },

    resetPassword: async (payload: ResetPasswordPayload) => {
        const response = await apiClient.post('/auth/reset-password', payload)
        return response.data
    },
    
    register: async (payload: any) => {
        const response = await apiClient.post('/auth/register', payload)
        return response.data
    }
}
