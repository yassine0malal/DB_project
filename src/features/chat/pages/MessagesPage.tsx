import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { mockConversations, mockMessages } from '../data/mockChat';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { Message } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const MessagesPage = () => {
    const {
        conversations,
        activeConversationId,
        messages,
        setConversations,
        setActiveConversation,
        addMessage,
        markAsRead
    } = useChatStore();

    const { user } = useAuthStore();

    useEffect(() => {
        // Load mock data
        if (conversations.length === 0) {
            setConversations(mockConversations);
            // Pre-load messages for the mock conversation
            mockConversations.forEach(conv => {
                if (!messages[conv.id]) {
                    mockMessages.forEach(msg => addMessage(conv.id, msg));
                }
            });
        }
    }, []);

    const handleSendMessage = (content: string) => {
        if (!activeConversationId || !user) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: user.id,
            content,
            timestamp: new Date().toISOString(),
            isRead: true,
            type: 'text'
        };

        addMessage(activeConversationId, newMessage);
    };

    const handleSelectConversation = (id: string) => {
        setActiveConversation(id);
        markAsRead(id);
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="w-80 flex-shrink-0">
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
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 space-y-4">
                        <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-gray-900 mb-1">Sélectionnez une conversation</h3>
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
