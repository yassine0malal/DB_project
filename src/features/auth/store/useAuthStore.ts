import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { useUserStore } from '../../profile/store/useUserStore';
import { api } from '../../../lib/api';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
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

            followUser: async (targetUserId) => {
                const state = get();
                if (!state.user) return;

                const following = state.user.following || [];
                if (following.includes(targetUserId)) return;

                // Optimistic update
                set({
                    user: {
                        ...state.user,
                        following: [...following, targetUserId]
                    } as User
                });

                try {
                    await api.followUser(state.user.id, targetUserId);
                } catch (error) {
                    console.error('Failed to follow user:', error);
                    // Revert
                    set({
                        user: {
                            ...state.user,
                            following
                        } as User
                    });
                }
            },

            unfollowUser: async (targetUserId) => {
                const state = get();
                if (!state.user) return;

                const following = state.user.following || [];
                const newFollowing = following.filter(id => id !== targetUserId);

                set({
                    user: {
                        ...state.user,
                        following: newFollowing
                    } as User
                });

                try {
                    await api.unfollowUser(state.user.id, targetUserId);
                } catch (error) {
                    console.error('Failed to unfollow user:', error);
                    // Revert
                    set({
                        user: {
                            ...state.user,
                            following
                        } as User
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
