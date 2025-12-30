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
    contacts: User[]; // Users the current user follows
    isLoading: boolean;

    // Actions
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (conversationId: string | null) => void;
    addMessage: (conversationId: string, message: Message) => void;
    markAsRead: (conversationId: string) => void;

    // Async Actions
    fetchConversations: (userId: string) => Promise<void>;
    fetchContacts: (userId: string) => Promise<void>;
    fetchMessages: (discussionId: string) => Promise<void>;
    sendMessage: (discussionId: string, userId: string, content: string) => Promise<void>;
    createDiscussion: (participants: string[], createdBy: string, title?: string) => Promise<string>;
    startChat: (userId: string, targetId: string) => Promise<string | undefined>;
}
