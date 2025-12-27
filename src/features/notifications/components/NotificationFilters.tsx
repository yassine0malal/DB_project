import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { NotificationFilter } from '../types';
import { useNotificationStore } from '../store/useNotificationStore';

export const NotificationFilters = () => {
    const { filter, setFilter, getUnreadCount } = useNotificationStore();
    const unreadCount = getUnreadCount();

    const filters: { label: string; value: NotificationFilter; count?: number }[] = [
        { label: 'Toutes', value: 'all' },
        { label: 'Non-lues', value: 'unread', count: unreadCount },
        { label: 'Mentions', value: 'mentions' },
    ];

    return (
        <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide border-b border-gray-100 mb-4">
            {filters.map((f) => (
                <Button
                    key={f.value}
                    variant={filter === f.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(f.value)}
                    className="rounded-full gap-2"
                >
                    {f.label}
                    {f.count !== undefined && f.count > 0 && (
                        <Badge variant="secondary" className="px-1.5 py-0 h-5 min-w-[1.25rem] bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                            {f.count}
                        </Badge>
                    )}
                </Button>
            ))}
        </div>
    );
};
