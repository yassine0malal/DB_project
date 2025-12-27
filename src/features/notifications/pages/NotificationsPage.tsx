import { isToday, isYesterday, isThisWeek } from 'date-fns';
import { Bell, Search } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationHeader } from '../components/NotificationHeader';
import { NotificationFilters } from '../components/NotificationFilters';
import { NotificationItem } from '../components/NotificationItem';
import { Notification } from '../types';

export const NotificationsPage = () => {
    const { getFilteredNotifications, searchQuery, filter } = useNotificationStore();
    const notifications = getFilteredNotifications();

    // Grouping Logic
    const grouped = notifications.reduce((acc, note) => {
        const date = new Date(note.createdAt);
        let key = 'Plus ancien';
        if (isToday(date)) key = "Aujourd'hui";
        else if (isYesterday(date)) key = "Hier";
        else if (isThisWeek(date)) key = "Cette semaine";

        if (!acc[key]) acc[key] = [];
        acc[key].push(note);
        return acc;
    }, {} as Record<string, Notification[]>);

    const groups = ["Aujourd'hui", "Hier", "Cette semaine", "Plus ancien"];

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <NotificationHeader />
            <NotificationFilters />

            <div className="space-y-8">
                {notifications.length > 0 ? (
                    groups.map(group => {
                        const notes = grouped[group];
                        if (!notes || notes.length === 0) return null;

                        return (
                            <div key={group} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-sm font-semibold text-gray-500 mb-3 ml-1 uppercase tracking-wider">{group}</h3>
                                <div className="space-y-1">
                                    {notes.map(note => (
                                        <NotificationItem key={note.id} notification={note} />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-8">
                        <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                            {searchQuery ? <Search className="h-8 w-8 text-gray-400" /> : <Bell className="h-8 w-8 text-gray-400" />}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {searchQuery ? 'Aucun résultat' : 'Aucune notification'}
                        </h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-1">
                            {searchQuery
                                ? "Essayez d'autres termes de recherche."
                                : filter === 'unread'
                                    ? "Vous avez tout lu ! C'est calme pour le moment."
                                    : "Vous n'avez pas encore de notifications."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
