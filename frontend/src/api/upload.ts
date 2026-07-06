import apiClient from '../lib/axios'

export interface UploadVideoResponseDto {
    url: string
}

export const uploadVideo = async (file: File): Promise<UploadVideoResponseDto> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/upload/video', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
