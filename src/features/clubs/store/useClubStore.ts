import { create } from 'zustand';
import { ClubState, ClubMember } from '../types';
import { User } from '../../auth/types';
import { localDB } from '../../../lib/localDB';

export const useClubStore = create<ClubState>((set, get) => ({
    clubs: [],
    activeClub: null,
    filters: {
        category: 'all',
        search: ''
    },

    setClubs: (clubs) => set({ clubs }),

    setActiveClub: (club) => set({ activeClub: club }),

    createClub: (club) => {
        set((state) => {
            const newClubs = [club, ...state.clubs];
            localDB.save({ clubs: newClubs });
            return { clubs: newClubs };
        });
    },

    joinClub: (clubId, user) => {
        const member: ClubMember = {
            user,
            role: 'member',
            joinedAt: new Date().toISOString()
        };

        set((state) => {
            const updatedClubs = state.clubs.map(club => {
                if (club.id === clubId) {
                    // Check if already member
                    if (club.members.some(m => m.user.id === user.id)) return club;
                    return { ...club, members: [...club.members, member] };
                }
                return club;
            });
            localDB.save({ clubs: updatedClubs });
            return { clubs: updatedClubs };
        });
    },

    leaveClub: (clubId, userId) => {
        set((state) => {
            const updatedClubs = state.clubs.map(club => {
                if (club.id === clubId) {
                    return { ...club, members: club.members.filter(m => m.user.id !== userId) };
                }
                return club;
            });
            localDB.save({ clubs: updatedClubs });
            return { clubs: updatedClubs };
        });
    },

    addEvent: (clubId, event) => {
        set((state) => {
            const updatedClubs = state.clubs.map(club => {
                if (club.id === clubId) {
                    return { ...club, events: [...club.events, event] };
                }
                return club;
            });
            localDB.save({ clubs: updatedClubs });
            return { clubs: updatedClubs };
        });
    },

    toggleParticipation: (eventId: string, user: User) => {
        set((state) => {
            const updatedClubs = state.clubs.map(club => ({
                ...club,
                events: club.events.map(event => {
                    if (event.id === eventId) {
                        const isParticipating = event.attendees.some(a => a.id === user.id);
                        const newAttendees = isParticipating
                            ? event.attendees.filter(a => a.id !== user.id)
                            : [...event.attendees, user];
                        return { ...event, attendees: newAttendees };
                    }
                    return event;
                })
            }));
            localDB.save({ clubs: updatedClubs });
            return { clubs: updatedClubs };
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
}));
