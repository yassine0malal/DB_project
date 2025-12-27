import { create } from 'zustand';
import { Group, GroupState, GroupType } from '../types';
import { User } from '../../auth/types';

export const useGroupStore = create<GroupState>((set, get) => ({
    groups: [],
    activeGroup: null,
    filters: {
        type: 'all',
        search: ''
    },

    setGroups: (groups) => set({ groups }),

    setActiveGroup: (group) => set({ activeGroup: group }),

    createGroup: (group) => set((state) => ({
        groups: [...state.groups, group]
    })),

    joinGroup: (groupId, user) => set((state) => ({
        groups: state.groups.map(group => {
            if (group.id === groupId) {
                const alreadyMember = group.members.some(m => m.user.id === user.id);
                if (alreadyMember) return group;
                return {
                    ...group,
                    members: [...group.members, {
                        user,
                        role: 'member' as const,
                        joinedAt: new Date().toISOString()
                    }]
                };
            }
            return group;
        }),
        activeGroup: state.activeGroup?.id === groupId
            ? {
                ...state.activeGroup,
                members: [...state.activeGroup.members, {
                    user,
                    role: 'member' as const,
                    joinedAt: new Date().toISOString()
                }]
            }
            : state.activeGroup
    })),

    leaveGroup: (groupId, userId) => set((state) => ({
        groups: state.groups.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    members: group.members.filter(m => m.user.id !== userId)
                };
            }
            return group;
        }),
        activeGroup: state.activeGroup?.id === groupId
            ? {
                ...state.activeGroup,
                members: state.activeGroup.members.filter(m => m.user.id !== userId)
            }
            : state.activeGroup
    })),

    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),

    getFilteredGroups: () => {
        const { groups, filters } = get();
        return groups.filter(group => {
            const matchesType = filters.type === 'all' || group.type === filters.type;
            const matchesSearch = group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                group.description.toLowerCase().includes(filters.search.toLowerCase());
            return matchesType && matchesSearch;
        });
    }
}));
