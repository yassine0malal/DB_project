import { create } from 'zustand';
import { Notification, NotificationState } from '../types';

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    filter: 'all',
    searchQuery: '',

    setFilter: (filter) => set({ filter }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),

    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => set((state) => ({
        notifications: [{
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            isRead: false,
            ...notification
        } as Notification, ...state.notifications]
    })),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        )
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    })),

    deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),

    getFilteredNotifications: () => {
        const { notifications, filter, searchQuery } = get();

        let filtered = notifications;

        // Apply tab filter
        if (filter === 'unread') {
            filtered = filtered.filter(n => !n.isRead);
        } else if (filter === 'mentions') {
            filtered = filtered.filter(n => n.title.toLowerCase().includes('mention'));
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(n =>
                n.title.toLowerCase().includes(query) ||
                n.message.toLowerCase().includes(query) ||
                (n.sender && n.sender.name.toLowerCase().includes(query))
            );
        }

        // Sort by date desc
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getUnreadCount: () => {
        return get().notifications.filter(n => !n.isRead).length;
    }
}));
