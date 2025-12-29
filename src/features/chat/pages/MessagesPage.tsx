import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { User } from '../../auth/types';

export const MessagesPage = () => {
    const {
        conversations,
        activeConversationId,
        messages,
        contacts,
        fetchConversations,
        fetchContacts,
        fetchMessages,
        sendMessage,
        createDiscussion,
        setActiveConversation,
        markAsRead
    } = useChatStore();

    const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');

    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchConversations(user.id);
            fetchContacts(user.id);
        }
    }, [user, fetchConversations, fetchContacts]);

    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
        }
    }, [activeConversationId, fetchMessages]);

    const handleSendMessage = async (content: string) => {
        if (!activeConversationId || !user) return;
        await sendMessage(activeConversationId, user.id, content);
    };

    const handleSelectConversation = (id: string) => {
        setActiveConversation(id);
        markAsRead(id);
    };

    const handleContactSelect = async (contact: User) => {
        if (!user) return;

        // Find existing conversation
        // Assuming 1-on-1 conversation has 2 participants and includes the contact
        const existing = conversations.find(c =>
            c.participants.length === 2 &&
            c.participants.some(p => p.id === contact.id)
        );

        if (existing) {
            setActiveConversation(existing.id);
        } else {
            const pIds = [user.id, contact.id];
            const newId = await createDiscussion(pIds, user.id);
            setActiveConversation(newId);
        }
        setActiveTab('chats');
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-80 flex-shrink-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
                <div className="flex border-b border-gray-100 dark:border-gray-800 p-2 space-x-2">
                    <button
                        onClick={() => setActiveTab('chats')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'chats'
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                    >
                        Discussions
                    </button>
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'contacts'
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                    >
                        Contacts
                    </button>
                </div>

                {activeTab === 'chats' ? (
                    <ChatList
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onConversationSelect={handleSelectConversation}
                    />
                ) : (
                    <div className="overflow-y-auto h-[calc(100vh-160px)]">
                        {contacts.length === 0 ? (
                            <div className="p-4 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Aucun contact trouvé.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Suivez des utilisateurs pour pouvoir discuter avec eux.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {contacts.map(contact => (
                                    <div
                                        key={contact.id}
                                        onClick={() => handleContactSelect(contact)}
                                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                    >
                                        <div className="relative">
                                            <img
                                                src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`}
                                                alt={`${contact.firstName} ${contact.lastName}`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {contact.firstName} {contact.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {contact.role}
                                            </p>
                                        </div>
                                        <div className="ml-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
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
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Sélectionnez une conversation</h3>
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
