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

    fetchNotifications: async (userId: string) => {
        try {
            const res = await fetch(`http://localhost:3000/api/notifications/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const data = await res.json();
            set({ notifications: data });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    },

    markAsRead: async (id) => {
        const previousNotifications = get().notifications;
        // Optimistic update
        set((state) => ({
            notifications: state.notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            )
        }));

        try {
            const res = await fetch(`http://localhost:3000/api/notifications/${id}/read`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to mark as read');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            set({ notifications: previousNotifications });
        }
    },

    markAllAsRead: async (userId: string) => {
        const previousNotifications = [...get().notifications];

        // Optimistic update
        set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, isRead: true }))
        }));

        try {
            const res = await fetch(`http://localhost:3000/api/notifications/read-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            if (!res.ok) throw new Error('Failed to mark all as read');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            set({ notifications: previousNotifications });
        }
    },

    deleteNotification: async (id) => {
        const previousNotifications = get().notifications;
        // Optimistic update
        set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
        }));

        try {
            const res = await fetch(`http://localhost:3000/api/notifications/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete notification');
        } catch (error) {
            console.error('Error deleting notification:', error);
            set({ notifications: previousNotifications });
        }
    },

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
