import { create } from 'zustand';
import { User } from '../../auth/types';
import { api } from '../../../lib/api';

interface UserState {
    users: User[];
    isLoading: boolean;
    error: string | null;
    setUsers: (users: User[]) => void;
    fetchUsers: () => Promise<void>;
    updateUser: (userId: string, data: Partial<User>) => void;
    getUserById: (userId: string) => User | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    setUsers: (users) => set({ users }),

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const users = await api.getUsers();
            set({ users, isLoading: false });
        } catch (error) {
            console.error('Error fetching users:', error);
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    updateUser: (userId, data) => set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...data } : u) as User[]
    })),

    getUserById: (userId) => {
        return (get().users || []).find(u => u.id === userId);
    }
}));
