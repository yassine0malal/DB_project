import { create } from 'zustand';
import { Group } from '../types';
import { api, API_URL } from '../../../lib/api';

interface GroupState {
    groups: Group[];
    isLoading: boolean;
    error: string | null;
    activeGroup: Group | null;
    filters: {
        type: 'all' | 'friends' | 'class' | 'club' | 'apartment';
        search: string;
    };
    fetchGroups: (userId?: string) => Promise<void>;
    fetchGroup: (id: string) => Promise<void>;
    setGroups: (groups: Group[]) => void;
    setActiveGroup: (group: Group | null) => void;
    createGroup: (group: Group) => void;
    joinGroup: (groupId: string, user: any) => Promise<void>;
    leaveGroup: (groupId: string, userId: string) => Promise<void>;
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

    fetchGroups: async (userId?: string) => {
        set({ isLoading: true, error: null });
        try {
            const url = userId
                ? `${API_URL}/groups?viewerId=${userId}`
                : `${API_URL}/groups`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch groups');
            const data = await response.json();

            // Map backend data to frontend model
            // Backend now returns isMember, so we can use it directly
            const mappedGroups = data.groups.map((g: any) => ({
                ...g,
                members: g.members || []
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

    joinGroup: async (groupId, user) => {
        try {
            await api.joinGroup(groupId, user.id);
            set((state) => {
                // Update groups list
                const updatedGroups = state.groups.map(group => {
                    if (group.id === groupId) {
                        return {
                            ...group,
                            isMember: true, // Explicitly set to true
                            members: [...(group.members || []), {
                                user,
                                role: 'member',
                                joinedAt: new Date().toISOString()
                            }]
                        };
                    }
                    return group;
                });

                // Update activeGroup if it matches
                const updatedActiveGroup = state.activeGroup?.id === groupId
                    ? {
                        ...state.activeGroup,
                        isMember: true, // Explicitly set to true
                        members: [...(state.activeGroup.members || []), { user, role: 'member', joinedAt: new Date().toISOString() }]
                    }
                    : state.activeGroup;

                return { groups: updatedGroups, activeGroup: updatedActiveGroup };
            });
        } catch (error) {
            console.error('Failed to join group:', error);
        }
    },

    leaveGroup: async (groupId, userId) => {
        try {
            await api.leaveGroup(groupId, userId);
            set((state) => {
                // Update groups list
                const updatedGroups = state.groups.map(group => {
                    if (group.id === groupId) {
                        return {
                            ...group,
                            isMember: false, // Explicitly set to false
                            members: (group.members || []).filter(m => m.user.id !== userId)
                        };
                    }
                    return group;
                });

                // Update activeGroup if it matches
                const updatedActiveGroup = state.activeGroup?.id === groupId
                    ? {
                        ...state.activeGroup,
                        isMember: false, // Explicitly set to false
                        members: (state.activeGroup.members || []).filter(m => m.user.id !== userId)
                    }
                    : state.activeGroup;

                return { groups: updatedGroups, activeGroup: updatedActiveGroup };
            });
        } catch (error) {
            console.error('Failed to leave group:', error);
        }
    },

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

