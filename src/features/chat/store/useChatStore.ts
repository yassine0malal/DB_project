import { create } from 'zustand';
import { ChatState } from '../types';


export const useChatStore = create<ChatState>((set) => ({
    conversations: [],
    activeConversationId: null,
    messages: {},
    isLoading: false,

    setConversations: (conversations) => set({ conversations }),

    setActiveConversation: (conversationId) => set({ activeConversationId: conversationId }),

    addMessage: (conversationId, message) => set((state) => {
        const conversationMessages = state.messages[conversationId] || [];
        return {
            messages: {
                ...state.messages,
                [conversationId]: [...conversationMessages, message]
            },
            // Update last message in conversation
            conversations: state.conversations.map(conv =>
                conv.id === conversationId
                    ? { ...conv, lastMessage: message, updatedAt: message.timestamp }
                    : conv
            )
        };
    }),

    markAsRead: (conversationId) => set((state) => ({
        conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
    }))
}));
