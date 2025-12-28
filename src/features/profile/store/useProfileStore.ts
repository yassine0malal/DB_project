import { create } from 'zustand';
import { User } from '../../auth/types';
import { api } from '../../../lib/api';

interface ProfileState {
    profile: User | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: (id: string) => Promise<void>;
    updateProfile: (id: string, data: Partial<User>) => Promise<void>;
    updateDetails: (id: string, role: string, details: any, social: any) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const profile = await api.getUser(id);
            set({ profile, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    updateProfile: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await api.updateUser(id, data);
            // Optimistic update or refetch
            const updated = await api.getUser(id);
            set({ profile: updated, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    updateDetails: async (id, role, details, social) => {
        set({ isLoading: true, error: null });
        try {
            await api.updateUserDetails(id, role, details, social);
            const updated = await api.getUser(id);
            set({ profile: updated, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    }
}));
