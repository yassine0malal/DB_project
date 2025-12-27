import { Notification } from '../types';
import { cn } from '../../../utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, Calendar, GraduationCap, MessageCircle, MoreHorizontal, Trash2, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownItem } from '../../../components/ui/dropdown-menu';
import { useNotificationStore } from '../store/useNotificationStore';
import { Link } from 'react-router-dom';

const TypeIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'club': return <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Users className="h-5 w-5" /></div>;
        case 'event': return <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Calendar className="h-5 w-5" /></div>;
        case 'academic': return <div className="bg-blue-100 p-2 rounded-full text-blue-600"><GraduationCap className="h-5 w-5" /></div>;
        default: return <div className="bg-gray-100 p-2 rounded-full text-gray-600"><MessageCircle className="h-5 w-5" /></div>;
    }
};

export const NotificationItem = ({ notification }: { notification: Notification }) => {
    const { markAsRead, deleteNotification } = useNotificationStore();

    return (
        <div className={cn(
            "group relative p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-100",
            !notification.isRead && "bg-blue-50/50 hover:bg-blue-50 border-blue-100/50"
        )}>
            <div className="flex gap-4">
                {/* Icon or Avatar */}
                <div className="shrink-0">
                    {notification.sender?.avatarUrl ? (
                        <div className="relative">
                            <img src={notification.sender.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                            <div className="absolute -bottom-1 -right-1 scale-75 shadow-sm rounded-full bg-white p-[2px]">
                                <TypeIcon type={notification.type} />
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
                            <p className={cn("text-sm font-medium text-gray-900", !notification.isRead && "font-bold text-black")}>
                                {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                {notification.message}
                            </p>
                        </Link>

                        {/* Actions */}
                        <DropdownMenu
                            trigger={
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
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
                        <span className="text-xs text-gray-400">
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
