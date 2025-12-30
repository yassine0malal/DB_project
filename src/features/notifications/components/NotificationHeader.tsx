import { Bell, CheckCheck, Settings } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const NotificationHeader = () => {
    const { markAllAsRead } = useNotificationStore();
    const { user } = useAuthStore();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="h-6 w-6 text-blue-600" />
                    Notifications
                </h1>
                <p className="text-gray-500 text-sm mt-1">Restez informé de toutes vos activités</p>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => user && markAllAsRead(user.id)}
                    className="gap-2"
                    disabled={!user}
                >
                    <CheckCheck className="h-4 w-4" />
                    Tout marquer comme lu
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:text-gray-600">
                    <Settings className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
