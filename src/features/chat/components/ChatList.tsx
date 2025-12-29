import { Conversation } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { cn } from '../../../utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useChatStore } from '../store/useChatStore';

interface ChatListProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onConversationSelect: (id: string) => void;
}

export const ChatList = ({ conversations, activeConversationId, onConversationSelect }: ChatListProps) => {
    const { user: currentUser } = useAuthStore();
    const { createDiscussion } = useChatStore();
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

    useEffect(() => {
        if (isSearching) {
            api.getUsers().then(setUsers).catch(console.error);
        }
    }, [isSearching]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = users.filter(u =>
                u.id !== currentUser?.id &&
                (`${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    }, [searchQuery, users, currentUser]);

    const handleStartChat = async (userId: string) => {
        if (!currentUser) return;

        // Check if conversation already exists
        const existing = conversations.find(c =>
            c.participants.length === 2 &&
            c.participants.some(p => p.id === userId)
        );

        if (existing) {
            onConversationSelect(existing.id);
        } else {
            try {
                const newId = await createDiscussion([currentUser.id, userId], currentUser.id);
                onConversationSelect(newId);
            } catch (error) {
                console.error('Failed to start chat:', error);
            }
        }
        setIsSearching(false);
        setSearchQuery('');
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800">
            <div className="p-4 border-b dark:border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Messages</h2>
                    <button
                        onClick={() => setIsSearching(!isSearching)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-blue-600"
                        title="Nouvelle discussion"
                    >
                        {isSearching ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>

                {isSearching && (
                    <div className="relative animate-in slide-in-from-top-2 duration-200">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un membre..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />

                        {searchQuery && (
                            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => handleStartChat(u.id)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                                                {u.avatarUrl ? (
                                                    <img src={u.avatarUrl} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-blue-600 font-bold">
                                                        {u.firstName[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {u.firstName} {u.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {u.role}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        Aucun membre trouvé
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
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
