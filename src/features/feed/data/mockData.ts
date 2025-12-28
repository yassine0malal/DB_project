import { Post } from '../types';

export const mockPosts: Post[] = [
    {
        id: 'p1',
        author: {
            id: 'u2',
            firstName: 'Thomas',
            lastName: 'Dubois',
            email: 'thomas.dubois@estiam.com',
            role: 'student',
            major: 'Informatique',
            studentId: 's12345',
            level: 'M1',
            academicYear: '2024-2025',
            followers: [],
            following: [],
            createdAt: '2023-09-01T10:00:00Z',
            avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100'
        },
        type: 'image',
        content: "Super hackathon ce week-end ! Merci à tous les participants. 🚀 #Hackathon2024",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c54be3855485?auto=format&fit=crop&q=80&w=1000",
        likesCount: 24,
        commentsCount: 5,
        sharesCount: 2,
        isLiked: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'p2',
        author: {
            id: 'u3',
            firstName: 'Sarah',
            lastName: 'Martin',
            email: 'sarah.martin@estiam.com',
            role: 'student',
            major: 'Design',
            studentId: 's12346',
            level: 'L3',
            academicYear: '2024-2025',
            followers: [],
            following: [],
            createdAt: '2023-09-01T10:00:00Z',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
        },
        type: 'poll',
        content: "Qui est chaud pour une séance de révision à la BU demain ?",
        likesCount: 8,
        commentsCount: 12,
        sharesCount: 0,
        isLiked: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        poll: {
            id: 'poll1',
            question: "Quelle heure ?",
            options: [
                { id: 'opt1', label: '10h - 12h', votes: 4 },
                { id: 'opt2', label: '14h - 16h', votes: 8 },
                { id: 'opt3', label: '16h - 18h', votes: 2 }
            ],
            totalVotes: 14,
            userVote: 'opt2',
            endDate: new Date(Date.now() + 86400000).toISOString()
        }
    }
];
