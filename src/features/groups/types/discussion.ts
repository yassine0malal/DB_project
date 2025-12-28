import { User } from '../../auth/types';

export interface Message {
    id: string;
    discussionId: string;
    author: User;
    content: string;
    createdAt: string;
}

export interface Discussion {
    id: string;
    groupId: string;
    title: string;
    createdBy: User;
    createdAt: string;
    messages?: Message[];
}
