import apiClient from '../lib/axios';

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string | null;
    tier: string;
    joinDate: string;
    passwordChangedAt: string | null;
    workoutsCompleted: number;
    currentStreak: number;
    activePlan: string;
}

export const getProfile = async (): Promise<UserProfile | null> => {
    try {
        const response = await apiClient.get<UserProfile>('/user/profile');
        return response.data;
    } catch (error) {
        console.error("Error fetching profile", error);
        return null;
    }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
        await apiClient.post('/user/change-password', { currentPassword, newPassword });
        return true;
    } catch (error) {
        console.error("Error changing password", error);
        return false;
    }
};
