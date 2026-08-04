import apiClient from '../lib/axios'

export interface UploadVideoResponseDto {
    url: string
}

export interface UploadSignatureResponseDto {
    signature: string
    timestamp: number
    apiKey: string
    cloudName: string
}

export const getUploadSignature = async (folder: string = 'fitness-training/exercises'): Promise<UploadSignatureResponseDto> => {
    const response = await apiClient.get('/upload/signature', { params: { folder } })
    return response.data
}

export const uploadVideo = async (file: File): Promise<UploadVideoResponseDto> => {
    // 1. Get signature from backend
    const { signature, timestamp, apiKey, cloudName } = await getUploadSignature()

    // 2. Prepare FormData for direct Cloudinary upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('folder', 'fitness-training/exercises')

    // 3. Post directly to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to upload video to Cloudinary')
    }

    const data = await response.json()
    return { url: data.secure_url }
}
export const uploadImage = async (formData: FormData): Promise<{ url: string }> => {
    const response = await apiClient.post('/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
