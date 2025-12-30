import { create } from 'zustand';
import { ChatState } from '../types';
import { api } from '../../../lib/api';

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    activeConversationId: null,
    messages: {},
    contacts: [],
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
    })),

    // Async Actions
    fetchConversations: async (userId: string) => {
        set({ isLoading: true });
        try {
            const data = await api.getDiscussions(userId);
            // Transform back to frontend type if necessary (camelCase mapping)
            const conversations = data.conversations.map((conv: any) => ({
                id: conv.id,
                participants: conv.participants,
                lastMessage: conv.lastMessage ? {
                    id: Math.random().toString(), // local id for display
                    senderId: conv.lastMessage.authorId,
                    content: conv.lastMessage.content,
                    timestamp: conv.lastMessage.createdAt,
                    isRead: true,
                    type: 'text'
                } : undefined,
                unreadCount: conv.unreadCount || 0,
                updatedAt: conv.updatedAt
            }));
            set({ conversations, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            set({ isLoading: false });
        }
    },

    fetchContacts: async (userId: string) => {
        try {
            const data = await api.getContacts(userId);
            set({ contacts: data.contacts });
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        }
    },

    fetchMessages: async (discussionId: string) => {
        set({ isLoading: true });
        try {
            const data = await api.getDiscussionMessages(discussionId);
            const messages = data.messages.map((msg: any) => ({
                id: msg.id.toString(),
                senderId: msg.author.id,
                content: msg.content,
                timestamp: msg.createdAt,
                isRead: true,
                type: 'text'
            }));
            set((state) => ({
                messages: {
                    ...state.messages,
                    [discussionId]: messages
                },
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            set({ isLoading: false });
        }
    },

    sendMessage: async (discussionId: string, userId: string, content: string) => {
        try {
            const newMessage = await api.sendDiscussionMessage(discussionId, userId, content);
            const formattedMessage = {
                id: newMessage.id.toString(),
                senderId: newMessage.author.id,
                content: newMessage.content,
                timestamp: newMessage.createdAt,
                isRead: true,
                type: 'text' as const
            };
            get().addMessage(discussionId, formattedMessage);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    },

    createDiscussion: async (participants: string[], createdBy: string, title?: string) => {
        try {
            const data = await api.createDiscussion(participants, createdBy, title);
            const newConvId = data.id;
            // Refetch conversations to include the new one
            await get().fetchConversations(createdBy);
            return newConvId;
        } catch (error) {
            console.error('Failed to create discussion:', error);
            throw error;
        }
    },

    startChat: async (userId: string, targetId: string) => {
        try {
            const data = await api.startDirectDiscussion(userId, targetId);
            const discussionId = data.id;
            // Refetch conversations to ensure it's in the list
            await get().fetchConversations(userId);
            set({ activeConversationId: discussionId });
            return discussionId;
        } catch (error) {
            console.error('Failed to start chat:', error);
        }
    }
}));
