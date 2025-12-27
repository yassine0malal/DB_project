import { User } from '../../auth/types';

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
}

export interface Conversation {
    id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: string;
}

export interface ChatState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Record<string, Message[]>; // conversationId -> messages
    isLoading: boolean;

    // Actions
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (conversationId: string | null) => void;
    addMessage: (conversationId: string, message: Message) => void;
    markAsRead: (conversationId: string) => void;
}
