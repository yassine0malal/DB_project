import { Conversation } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { cn } from '../../../utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatListProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onConversationSelect: (id: string) => void;
}

export const ChatList = ({ conversations, activeConversationId, onConversationSelect }: ChatListProps) => {
    const { user: currentUser } = useAuthStore();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800">
            <div className="p-4 border-b dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        Aucune conversation
                    </div>
                ) : (
                    conversations.map((conv) => {
                        const otherParticipant = conv.participants.find(p => p.id !== currentUser?.id);
                        const isActive = activeConversationId === conv.id;

                        return (
                            <button
                                key={conv.id}
                                onClick={() => onConversationSelect(conv.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 text-left",
                                    isActive && "bg-blue-50/50 dark:bg-blue-900/10"
                                )}
                            >
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                                        {otherParticipant?.avatarUrl ? (
                                            <img src={otherParticipant.avatarUrl} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-blue-600 font-bold">
                                                {otherParticipant?.firstName[0]}
                                            </div>
                                        )}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {otherParticipant?.firstName} {otherParticipant?.lastName}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 capitalize">
                                            {conv.lastMessage && format(new Date(conv.lastMessage.timestamp), 'HH:mm', { locale: fr })}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-sm truncate",
                                        conv.unreadCount > 0 ? "text-gray-900 dark:text-gray-100 font-bold" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {conv.lastMessage?.content || "Dites bonjour !"}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
