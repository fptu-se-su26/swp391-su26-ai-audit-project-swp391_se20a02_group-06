import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5007/api';

const getAuthHeaders = () => {
    const token = useAuthStore.getState().accessToken;
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

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
        const response = await axios.get(`${API_URL}/user/profile`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching profile", error);
        return null;
    }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
        await axios.post(`${API_URL}/user/change-password`, { currentPassword, newPassword }, getAuthHeaders());
        return true;
    } catch (error) {
        console.error("Error changing password", error);
        return false;
    }
};
