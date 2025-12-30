import { create } from 'zustand';
import { ClubState, ClubMember, Club } from '../types';
import { User } from '../../auth/types';
import { api } from '../../../lib/api';
import { useEventStore } from '../../events/store/useEventStore';

interface ClubStore extends ClubState {
    setClubs: (clubs: Club[]) => void;
    setActiveClub: (club: Club | null) => void;
    createClub: (club: Club) => void;
    joinClub: (clubId: string, user: User) => Promise<void>;
    leaveClub: (clubId: string, userId: string) => Promise<void>;
    addEvent: (clubId: string, event: any) => void;
    toggleParticipation: (eventId: string, user: User) => void;
    setFilter: (key: keyof ClubState['filters'], value: string) => void;
    getFilteredClubs: () => Club[];

    // API Actions
    fetchClubs: (viewerId?: string) => Promise<void>;
    fetchClubDetails: (id: string, viewerId?: string) => Promise<void>;
}

export const useClubStore = create<ClubStore>((set, get) => {
    return {
        clubs: [],
        activeClub: null,
        filters: {
            category: 'all',
            search: ''
        },
        isLoading: false,
        error: null,

        setClubs: (clubs) => set({ clubs }),

        setActiveClub: (club) => set({ activeClub: club }),

        fetchClubs: async (viewerId) => {
            set({ isLoading: true, error: null });
            try {
                const { clubs } = await api.getClubs(viewerId);
                set({ clubs, isLoading: false });
            } catch (error) {
                console.error(error);
                set({ error: (error as Error).message, isLoading: false });
            }
        },

        fetchClubDetails: async (id, viewerId) => {
            set({ isLoading: true, error: null });
            try {
                const club = await api.getClub(id, viewerId);
                set({ activeClub: club, isLoading: false });
            } catch (error) {
                console.error(error);
                set({ error: (error as Error).message, isLoading: false });
            }
        },

        createClub: (club) => {
            // TODO: API endpoint
            set((state) => ({ clubs: [club, ...state.clubs] }));
        },

        joinClub: async (clubId, user) => {
            // Optimistic
            set((state) => {
                const updatedClubs = state.clubs.map(club => {
                    if (club.id === clubId) {
                        if ((club.members || []).some(m => m.user.id === user.id)) return club;
                        const member: ClubMember = { user, role: 'member', joinedAt: new Date().toISOString() };
                        return { ...club, members: [...(club.members || []), member], membersCount: (club.membersCount || 0) + 1, isMember: true };
                    }
                    return club;
                });

                // Also update activeClub if it's the one
                const active = state.activeClub?.id === clubId
                    ? { ...state.activeClub, members: [...(state.activeClub.members || []), { user, role: 'member', joinedAt: new Date().toISOString() }], membersCount: (state.activeClub.membersCount || 0) + 1, isMember: true }
                    : state.activeClub;

                return { clubs: updatedClubs, activeClub: active as Club };
            });

            await api.joinClub(clubId, user.id);
        },

        leaveClub: async (clubId, userId) => {
            // Optimistic
            set((state) => {
                const updatedClubs = state.clubs.map(club => {
                    if (club.id === clubId) {
                        return {
                            ...club,
                            members: (club.members || []).filter(m => m.user.id !== userId),
                            membersCount: Math.max(0, (club.membersCount || 0) - 1),
                            isMember: false
                        };
                    }
                    return club;
                });

                const active = state.activeClub?.id === clubId
                    ? {
                        ...state.activeClub,
                        members: (state.activeClub.members || []).filter(m => m.user.id !== userId),
                        membersCount: Math.max(0, (state.activeClub.membersCount || 0) - 1),
                        isMember: false
                    }
                    : state.activeClub;

                return { clubs: updatedClubs, activeClub: active as Club };
            });

            await api.leaveClub(clubId, userId);
        },

        addEvent: (clubId, event) => {
            // Placeholder for now
            console.log("Add event local", clubId, event);
        },

        toggleParticipation: async (eventId, user) => {
            const { joinEvent, leaveEvent, events } = useEventStore.getState();
            const event = events.find(e => e.id === eventId);
            const isAttending = event?.isAttending;

            if (isAttending) {
                await leaveEvent(eventId, user.id);
            } else {
                await joinEvent(eventId, user.id);
            }

            // Sync local club events if they exist
            set((state) => {
                const updateEvent = (e: any) => e.id === eventId
                    ? { ...e, isAttending: !isAttending, attendeesCount: (e.attendeesCount || 0) + (isAttending ? -1 : 1) }
                    : e;

                const updatedClubs = state.clubs.map(club => ({
                    ...club,
                    events: (club.events || []).map(updateEvent)
                }));

                let active = state.activeClub;
                if (active && (active.id === event?.clubId || active.events?.some((e: any) => e.id === eventId))) {
                    active = {
                        ...active,
                        events: (active.events || []).map(updateEvent)
                    };
                }

                return { clubs: updatedClubs, activeClub: active };
            });
        },

        setFilter: (key, value) => set((state) => ({
            filters: { ...state.filters, [key]: value }
        })),

        getFilteredClubs: () => {
            const { clubs, filters } = get();
            return clubs.filter(club => {
                const matchesCategory = filters.category === 'all' || club.category === filters.category;
                const matchesSearch = club.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    club.description.toLowerCase().includes(filters.search.toLowerCase());
                return matchesCategory && matchesSearch;
            });
        }
    };
});
