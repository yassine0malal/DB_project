import { create } from 'zustand';
import { User } from '../../auth/types';
import { MOCK_USERS } from '../../auth/data/mockUsers';

interface UserState {
    users: User[];
    setUsers: (users: User[]) => void;
    updateUser: (userId: string, data: Partial<User>) => void;
    getUserById: (userId: string) => User | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: MOCK_USERS,

    setUsers: (users) => set({ users }),

    updateUser: (userId, data) => set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...data } : u) as User[]
    })),

    getUserById: (userId) => {
        return get().users.find(u => u.id === userId);
    }
}));
