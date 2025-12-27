import { Conversation, Message } from '../types';
import { MOCK_STUDENT, MOCK_TEACHER } from '../../auth/data/mockUsers';

const student = MOCK_STUDENT;
const teacher = MOCK_TEACHER;

export const mockMessages: Message[] = [
    {
        id: 'm1',
        senderId: teacher.id,
        content: "Bonjour ! Avez-vous des questions sur le projet de base de données ?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
        type: 'text'
    },
    {
        id: 'm2',
        senderId: student.id,
        content: "Oui, je me demandais comment implémenter les relations Many-to-Many.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isRead: true,
        type: 'text'
    },
    {
        id: 'm3',
        senderId: teacher.id,
        content: "C'est une excellente question. Il faut utiliser une table de jointure.",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isRead: false,
        type: 'text'
    }
];

export const mockConversations: Conversation[] = [
    {
        id: 'c1',
        participants: [student, teacher],
        lastMessage: mockMessages[2],
        unreadCount: 1,
        updatedAt: mockMessages[2].timestamp
    }
];
