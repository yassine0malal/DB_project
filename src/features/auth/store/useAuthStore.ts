import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { MOCK_STUDENT } from '../data/mockUsers';
import { useUserStore } from '../../profile/store/useUserStore';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: MOCK_STUDENT, // Default to student
            token: 'mock-token',
            isAuthenticated: true,
            isLoading: false,

            login: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            updateUser: (updatedUser) => {
                set((state) => {
                    if (!state.user) return state;
                    const newUser = { ...state.user, ...updatedUser } as User;

                    // Sync with central user store
                    useUserStore.getState().updateUser(state.user.id, updatedUser);

                    return { user: newUser };
                });
            },

            followUser: (targetUserId) => {
                set((state) => {
                    if (!state.user) return state;
                    const following = state.user.following || [];
                    if (following.includes(targetUserId)) return state;
                    return {
                        user: {
                            ...state.user,
                            following: [...following, targetUserId]
                        } as User
                    };
                });
            },

            unfollowUser: (targetUserId) => {
                set((state) => {
                    if (!state.user) return state;
                    const following = state.user.following || [];
                    return {
                        user: {
                            ...state.user,
                            following: following.filter(id => id !== targetUserId)
                        } as User
                    };
                });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
