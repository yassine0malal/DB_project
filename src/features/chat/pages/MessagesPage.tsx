import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const MessagesPage = () => {
    const {
        conversations,
        activeConversationId,
        messages,
        fetchConversations,
        fetchMessages,
        sendMessage,
        setActiveConversation,
        markAsRead
    } = useChatStore();

    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchConversations(user.id);
        }
    }, [user, fetchConversations]);

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

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-80 flex-shrink-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
                <ChatList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onConversationSelect={handleSelectConversation}
                />
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
