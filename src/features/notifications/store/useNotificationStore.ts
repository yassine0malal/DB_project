import { create } from 'zustand';
import { Notification, NotificationState } from '../types';

// Helper to generate mock dates
const minutesAgo = (mins: number) => new Date(Date.now() - mins * 60 * 1000).toISOString();
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'social',
        title: 'Nouvelle mention',
        message: 'Sarah Connor vous a mentionné dans un commentaire.',
        isRead: false,
        createdAt: minutesAgo(5),
        link: '/feed/post/1',
        sender: {
            name: 'Sarah Connor',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
        }
    },
    {
        id: '2',
        type: 'club',
        title: 'Nouveau post dans Club Info',
        message: 'Le hackathon commence demain ! Préparez vos équipes.',
        isRead: false,
        createdAt: hoursAgo(2),
        link: '/clubs/1',
        sender: {
            name: 'Club Info',
            avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=100&h=100'
        }
    },
    {
        id: '3',
        type: 'event',
        title: 'Rappel Événement',
        message: 'La conférence "Finance Verte" commence dans 1 heure.',
        isRead: true,
        createdAt: hoursAgo(5),
        link: '/events/e5',
        sender: {
            name: 'Système'
        }
    },
    {
        id: '4',
        type: 'academic',
        title: 'Note disponible',
        message: 'Votre note pour le module "Base de Données" est disponible.',
        isRead: true,
        createdAt: daysAgo(1),
        link: '/academic',
        sender: {
            name: 'Administration'
        }
    },
    {
        id: '5',
        type: 'social',
        title: 'Nouveau follower',
        message: 'John Doe a commencé à vous suivre.',
        isRead: true,
        createdAt: daysAgo(2),
        link: '/profile/johndoe',
        sender: {
            name: 'John Doe',
            avatarUrl: 'https://i.pravatar.cc/150?u=john'
        }
    },
    {
        id: '6',
        type: 'club',
        title: 'Invitation au club',
        message: 'Le Bureau des Sports vous invite à rejoindre le club.',
        isRead: false,
        createdAt: daysAgo(3),
        link: '/clubs/2',
        sender: {
            name: 'BDS',
            avatarUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=100&h=100'
        }
    }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: mockNotifications,
    filter: 'all',
    searchQuery: '',

    setFilter: (filter) => set({ filter }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),

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
