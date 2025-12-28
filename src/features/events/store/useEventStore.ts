import { create } from 'zustand';
import { ClubEvent } from '../../clubs/types';
import { api } from '../../../lib/api';

interface EventFilters {
    search: string;
    date: 'all' | 'today' | 'week';
    onCampus: boolean;
    online: boolean;
}

interface EventState {
    events: ClubEvent[];
    filters: EventFilters;
    isLoading: boolean;
    error: string | null;

    setEvents: (events: ClubEvent[]) => void;

    // API Actions
    fetchEvents: (viewerId?: string) => Promise<void>;
    joinEvent: (eventId: string, userId: string) => Promise<void>;
    leaveEvent: (eventId: string, userId: string) => Promise<void>;

    setFilter: (key: keyof EventFilters, value: any) => void;
    getFilteredEvents: () => ClubEvent[];
}

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    filters: {
        search: '',
        date: 'all',
        onCampus: false,
        online: false
    },
    isLoading: false,
    error: null,

    setEvents: (events) => set({ events }),

    fetchEvents: async (viewerId) => {
        set({ isLoading: true, error: null });
        try {
            const { events } = await api.getEvents(viewerId);
            set({ events, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: (error as Error).message });
        }
    },

    joinEvent: async (eventId, userId) => {
        // Optimistic update
        set(state => ({
            events: state.events.map(e =>
                e.id === eventId
                    ? { ...e, isAttending: true, attendeesCount: (e.attendeesCount || 0) + 1 }
                    : e
            )
        }));
        try {
            await api.joinEvent(eventId, userId);
        } catch (error) {
            // Revert
            set(state => ({
                events: state.events.map(e =>
                    e.id === eventId
                        ? { ...e, isAttending: false, attendeesCount: Math.max(0, (e.attendeesCount || 0) - 1) }
                        : e
                )
            }));
            console.error(error);
        }
    },

    leaveEvent: async (eventId, userId) => {
        // Optimistic update
        set(state => ({
            events: state.events.map(e =>
                e.id === eventId
                    ? { ...e, isAttending: false, attendeesCount: Math.max(0, (e.attendeesCount || 0) - 1) }
                    : e
            )
        }));
        try {
            await api.leaveEvent(eventId, userId);
        } catch (error) {
            // Revert
            set(state => ({
                events: state.events.map(e =>
                    e.id === eventId
                        ? { ...e, isAttending: true, attendeesCount: (e.attendeesCount || 0) + 1 }
                        : e
                )
            }));
            console.error(error);
        }
    },

    setFilter: (key, value) => set(state => ({
        filters: { ...state.filters, [key]: value }
    })),

    getFilteredEvents: () => {
        const { events, filters } = get();
        return events.filter(event => {
            // Search
            if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

            // Date
            const eventDate = new Date(event.date);
            const today = new Date();
            if (filters.date === 'today' && eventDate.getDate() !== today.getDate()) return false;
            if (filters.date === 'week') {
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);
                if (eventDate > nextWeek || eventDate < today) return false;
            }

            // Location
            if (filters.onCampus && event.isOnline) return false;
            if (filters.online && !event.isOnline) return false;
            if (filters.onCampus && !filters.online && event.isOnline) return false;
            if (filters.online && !filters.onCampus && !event.isOnline) return false;

            return true;
        });
    }
}));
