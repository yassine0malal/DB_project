import { create } from 'zustand';
import { Group } from '../types';

interface GroupState {
    groups: Group[];
    isLoading: boolean;
    error: string | null;
    activeGroup: Group | null;
    filters: {
        type: 'all' | 'friends' | 'class' | 'club' | 'apartment';
        search: string;
    };
    fetchGroups: () => Promise<void>;
    fetchGroup: (id: string) => Promise<void>;
    setGroups: (groups: Group[]) => void;
    setActiveGroup: (group: Group | null) => void;
    createGroup: (group: Group) => void;
    joinGroup: (groupId: string, user: any) => void;
    leaveGroup: (groupId: string, userId: string) => void;
    setFilter: (key: string, value: any) => void;
    getFilteredGroups: () => Group[];
}

export const useGroupStore = create<GroupState>((set, get) => ({
    groups: [],
    isLoading: false,
    error: null,
    activeGroup: null,
    filters: {
        type: 'all',
        search: ''
    },

    fetchGroups: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:3000/api/groups');
            if (!response.ok) throw new Error('Failed to fetch groups');
            const data = await response.json();

            // Map backend data to frontend model (ensure members array exists if backend doesn't send it)
            const mappedGroups = data.groups.map((g: any) => ({
                ...g,
                members: g.members || [] // Backend might not send members list in list view
            }));

            set({ groups: mappedGroups, isLoading: false });
        } catch (error) {
            console.error('Error fetching groups:', error);
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    fetchGroup: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`http://localhost:3000/api/groups/${id}`);
            if (!response.ok) throw new Error('Failed to fetch group');
            const group = await response.json();

            set({ activeGroup: group, isLoading: false });
        } catch (error) {
            console.error('Error fetching group:', error);
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    setGroups: (groups) => set({ groups }),

    setActiveGroup: (group) => set({ activeGroup: group }),

    createGroup: (group) => {
        set((state) => {
            const newGroups = [...state.groups, group];
            return { groups: newGroups };
        });
    },

    joinGroup: (groupId, user) => set((state) => {
        return {
            groups: state.groups.map(group => {
                if (group.id === groupId) {
                    // Optimistic update
                    return {
                        ...group,
                        members: [...(group.members || []), {
                            user,
                            role: 'member',
                            joinedAt: new Date().toISOString()
                        }]
                    };
                }
                return group;
            })
        };
    }),

    leaveGroup: (groupId, userId) => set((state) => {
        return {
            groups: state.groups.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        members: (group.members || []).filter(m => m.user.id !== userId)
                    };
                }
                return group;
            })
        };
    }),

    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),

    getFilteredGroups: () => {
        const { groups, filters } = get();
        return groups.filter(group => {
            const matchesType = filters.type === 'all' || group.type === filters.type;
            const matchesSearch = group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                (group.description && group.description.toLowerCase().includes(filters.search.toLowerCase()));
            return matchesType && matchesSearch;
        });
    }
}));

