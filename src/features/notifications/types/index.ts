export type NotificationType = 'social' | 'club' | 'event' | 'academic';
export type NotificationFilter = 'all' | 'unread' | 'mentions';

export interface NotificationSender {
    name: string;
    avatarUrl?: string;
    id?: string;
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string; // ISO Date string
    link?: string;
    sender?: NotificationSender;
    metadata?: {
        eventId?: string;
        clubId?: string;
        postId?: string;
        [key: string]: any;
    };
}

export interface NotificationState {
    notifications: Notification[];
    filter: NotificationFilter;
    searchQuery: string;

    // Actions
    fetchNotifications: (userId: string) => Promise<void>;
    setFilter: (filter: NotificationFilter) => void;
    setSearchQuery: (query: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: (userId: string) => void;
    deleteNotification: (id: string) => void;

    // Selectors
    getFilteredNotifications: () => Notification[];
    getUnreadCount: () => number;
}
