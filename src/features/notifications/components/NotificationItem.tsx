import { Notification } from '../types';
import { cn } from '../../../utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, Calendar, GraduationCap, MessageCircle, MoreHorizontal, Trash2, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownItem } from '../../../components/ui/dropdown-menu';
import { useNotificationStore } from '../store/useNotificationStore';
import { Link } from 'react-router-dom';

const TypeIcon = ({ type, size = 'md' }: { type: Notification['type']; size?: 'sm' | 'md' }) => {
    const iconClass = size === 'sm' ? "h-3 w-3" : "h-5 w-5";
    const containerClass = size === 'sm' ? "p-1" : "p-2";

    const getColors = () => {
        switch (type) {
            case 'club': return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
            case 'event': return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
            case 'academic': return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
            default: return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
        }
    };

    const Icon = () => {
        switch (type) {
            case 'club': return <Users className={iconClass} />;
            case 'event': return <Calendar className={iconClass} />;
            case 'academic': return <GraduationCap className={iconClass} />;
            default: return <MessageCircle className={iconClass} />;
        }
    };

    return (
        <div className={`${getColors()} ${containerClass} rounded-full`}>
            <Icon />
        </div>
    );
};

export const NotificationItem = ({ notification }: { notification: Notification }) => {
    const { markAsRead, deleteNotification } = useNotificationStore();

    return (
        <div className={cn(
            "group relative p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700",
            !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-100/50 dark:border-blue-800/50"
        )}>
            <div className="flex gap-4">
                {/* Icon or Avatar */}
                <div className="shrink-0">
                    {notification.sender?.avatarUrl ? (
                        <div className="relative">
                            <img src={notification.sender.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                            <div className="absolute -bottom-1 -right-1 shadow-sm rounded-full bg-white dark:bg-gray-800 p-[2px]">
                                <TypeIcon type={notification.type} size="sm" />
                            </div>
                        </div>
                    ) : (
                        <TypeIcon type={notification.type} />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <Link to={notification.link || '#'} onClick={() => markAsRead(notification.id)} className="block">
                            <p className={cn("text-sm font-medium text-gray-900 dark:text-gray-100", !notification.isRead && "font-bold text-black dark:text-white")}>
                                {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                {notification.message}
                            </p>
                        </Link>

                        {/* Actions */}
                        <DropdownMenu
                            trigger={
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </Button>
                            }
                        >
                            <DropdownItem onClick={() => markAsRead(notification.id)}>
                                <div className="flex items-center">
                                    <Check className="h-4 w-4 mr-2" />
                                    Marquer comme lu
                                </div>
                            </DropdownItem>
                            <DropdownItem onClick={() => deleteNotification(notification.id)} destructive>
                                <div className="flex items-center">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                        </span>
                        {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
