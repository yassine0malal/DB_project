import { User } from '../../auth/types';

export interface Reply {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    likesCount: number;
}

export interface Comment {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    likesCount: number;
    replies?: Reply[];
}

export interface PollOption {
    id: string;
    label: string;
    votes: number;
}

export interface Poll {
    question: string;
    options: PollOption[];
    userVote?: string; // optionId of the user's vote
    totalVotes: number;
    endDate?: string;
}

export interface Report {
    id: string;
    targetId: string;
    targetType: 'post' | 'comment';
    reason: string;
    userId: string;
    createdAt: string;
}

export type PostType = 'text' | 'image' | 'poll';

export interface Post {
    id: string;
    type: PostType;
    content: string;
    imageUrl?: string;
    poll?: Poll;
    createdAt: string; // ISO string
    author: User;
    likesCount: number;
    commentsCount: number;
    sharesCount: number; // Added
    isLiked?: boolean;
    comments?: Comment[];
}
