import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { ChatWindow } from '../components/ChatWindow';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { User } from '../../auth/types';

export const MessagesPage = () => {
    const conversations = useChatStore(state => state.conversations);
    const activeConversationId = useChatStore(state => state.activeConversationId);
    const messages = useChatStore(state => state.messages);
    const contacts = useChatStore(state => state.contacts);
    const fetchConversations = useChatStore(state => state.fetchConversations);
    const fetchContacts = useChatStore(state => state.fetchContacts);
    const fetchMessages = useChatStore(state => state.fetchMessages);
    const sendMessage = useChatStore(state => state.sendMessage);
    const startChat = useChatStore(state => state.startChat);
    const setActiveConversation = useChatStore(state => state.setActiveConversation);
    const markAsRead = useChatStore(state => state.markAsRead);

    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchConversations(user.id);
            // Ensure we fetch contacts
            fetchContacts(user.id);
        }
    }, [user, fetchConversations, fetchContacts]);

    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
        }
    }, [activeConversationId, fetchMessages]);

    // Polling for dynamic updates
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            fetchConversations(user.id);
            if (activeConversationId) {
                fetchMessages(activeConversationId);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [user, activeConversationId, fetchConversations, fetchMessages]);

    const handleSendMessage = async (content: string) => {
        if (!activeConversationId || !user) return;
        await sendMessage(activeConversationId, user.id, content);
    };

    const handleContactSelect = async (contact: User) => {
        if (!user) return;

        try {
            const discussionId = await startChat(user.id, contact.id);
            if (discussionId) {
                // Ensure the conversation is marked as read and active
                setActiveConversation(discussionId);
                markAsRead(discussionId);
            }
        } catch (error) {
            console.error('Failed to start chat from contact:', error);
        }
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col h-full border-r border-gray-100 dark:border-gray-800">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Messages</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher un contact..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Aucun contact trouvé.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Suivez des utilisateurs pour les voir ici.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {contacts.map(contact => {
                                // Find existing conversation with this contact
                                const conv = conversations.find(c =>
                                    c.participants.some(p => p.id === contact.id)
                                );
                                const isActive = activeConversationId === conv?.id;

                                return (
                                    <div
                                        key={contact.id}
                                        onClick={() => handleContactSelect(contact)}
                                        className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`}
                                                alt={`${contact.firstName} ${contact.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            {conv?.unreadCount && conv.unreadCount > 0 ? (
                                                <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                                    {conv.unreadCount}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className={`text-sm font-semibold truncate ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                    {contact.firstName} {contact.lastName}
                                                </p>
                                                {conv?.lastMessage && (
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                                {conv?.lastMessage ? conv.lastMessage.content : "Commencer la discussion"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 border-l">
                {activeConversation ? (
                    <ChatWindow
                        conversation={activeConversation}
                        messages={messages[activeConversation.id] || []}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="h-24 w-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Sélectionnez une conversation.</h3>
                            <p className="text-sm max-w-[250px]">
                                Choisissez une conversation dans la liste pour commencer à discuter.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
