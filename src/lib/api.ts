import { User } from '../features/auth/types';

export const API_URL = 'http://localhost:3000/api';

export const api = {
    getUsers: async () => {
        const res = await fetch(`${API_URL}/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        return data.users.map((u: any) => ({
            id: u.id,
            email: u.email,
            firstName: u.first_name,
            lastName: u.last_name,
            role: u.role,
            avatarUrl: u.avatar_url
        }));
    },

    getFollowing: async (userId: string) => {
        const res = await fetch(`${API_URL}/users/${userId}/following`);
        if (!res.ok) throw new Error('Failed to fetch following');
        return res.json();
    },

    getContacts: async (userId: string) => {
        const res = await fetch(`${API_URL}/contacts?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch contacts');
        return res.json();
    },

    addContact: async (userId: string, contactId: string) => {
        const res = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, contactId })
        });
        if (!res.ok) throw new Error('Failed to add contact');
        return res.json();
    },

    startDirectDiscussion: async (userId1: string, userId2: string) => {
        const res = await fetch(`${API_URL}/discussions/start?userId1=${userId1}&userId2=${userId2}`);
        if (!res.ok) throw new Error('Failed to start discussion');
        return res.json();
    },

    getFollowers: async (userId: string) => {
        const res = await fetch(`${API_URL}/users/${userId}/followers`);
        if (!res.ok) throw new Error('Failed to fetch followers');
        return res.json();
    },

    followUser: async (userId: string, targetId: string) => {
        const res = await fetch(`${API_URL}/users/${targetId}/follow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to follow user');
        return res.json();
    },

    unfollowUser: async (userId: string, targetId: string) => {
        const res = await fetch(`${API_URL}/users/${targetId}/unfollow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to unfollow user');
        return res.json();
    },

    getUser: async (id: string) => {
        const res = await fetch(`${API_URL}/users/${id}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();

        // Transform DB snake_case to frontend camelCase if needed
        // For now, mapping critical fields manually or assuming strict types
        // Ideally we use a mapper.

        // Quick/Dirty mapping for demo purposes, robust apps should use DTOs
        const user: any = {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            role: data.role,
            avatarUrl: data.avatar_url,
            coverUrl: data.cover_url,
            bio: data.bio,
            // Spread other details directly
            ...data
        };

        // Parse JSON fields if they come as strings (SQLite stores valid JSON as text)
        if (typeof user.skills === 'string') user.skills = JSON.parse(user.skills);
        if (typeof user.interests === 'string') user.interests = JSON.parse(user.interests);

        return user;
    },

    updateUser: async (id: string, data: Partial<User>) => {
        const body = {
            first_name: data.firstName,
            last_name: data.lastName,
            bio: data.bio,
            avatar_url: data.avatarUrl,
            cover_url: data.coverUrl
        };
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Failed to update user');
        return res.json();
    },

    updateUserDetails: async (id: string, role: string, details: any, social: any) => {
        const res = await fetch(`${API_URL}/users/${id}/details`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, details, social })
        });
        if (!res.ok) throw new Error('Failed to update details');
        return res.json();
    },

    // Feed
    getPosts: async (viewerId?: string) => {
        const query = viewerId ? `?viewerId=${viewerId}` : '';
        const res = await fetch(`${API_URL}/posts${query}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
    },

    createPost: async (post: any) => {
        const res = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
        if (!res.ok) throw new Error('Failed to create post');
        return res.json();
    },

    toggleLike: async (postId: string, userId: string) => {
        const res = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to toggle like');
        return res.json();
    },

    createComment: async (postId: string, userId: string, content: string, parentCommentId?: string) => {
        const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, content, parentCommentId })
        });
        if (!res.ok) throw new Error('Failed to create comment');
        return res.json();
    },

    // Clubs
    getClubs: async (viewerId?: string) => {
        const query = viewerId ? `?viewerId=${viewerId}` : '';
        const res = await fetch(`${API_URL}/clubs${query}`);
        if (!res.ok) throw new Error('Failed to fetch clubs');
        return res.json();
    },

    getClub: async (id: string, viewerId?: string) => {
        const query = viewerId ? `?viewerId=${viewerId}` : '';
        const res = await fetch(`${API_URL}/clubs/${id}${query}`);
        if (!res.ok) throw new Error('Failed to fetch club');
        return res.json();
    },

    joinClub: async (clubId: string, userId: string) => {
        const res = await fetch(`${API_URL}/clubs/${clubId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to join club');
        return res.json();
    },

    leaveClub: async (clubId: string, userId: string) => {
        const res = await fetch(`${API_URL}/clubs/${clubId}/leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to leave club');
        return res.json();
    },

    // Events
    getEvents: async (viewerId?: string) => {
        const query = viewerId ? `?viewerId=${viewerId}` : '';
        const res = await fetch(`${API_URL}/events${query}`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    },

    getEvent: async (id: string, viewerId?: string) => {
        const query = viewerId ? `?viewerId=${viewerId}` : '';
        const res = await fetch(`${API_URL}/events/${id}${query}`);
        if (!res.ok) throw new Error('Failed to fetch event');
        return res.json();
    },

    joinEvent: async (eventId: string, userId: string) => {
        const res = await fetch(`${API_URL}/events/${eventId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to join event');
        return res.json();
    },

    leaveEvent: async (eventId: string, userId: string) => {
        const res = await fetch(`${API_URL}/events/${eventId}/leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to leave event');
        return res.json();
    },

    toggleCommentLike: async (commentId: string, userId: string) => {
        const res = await fetch(`${API_URL}/comments/${commentId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to toggle comment like');
        return res.json();
    },

    getComments: async (postId: string, viewerId?: string) => {
        const query = viewerId ? `?viewerId=${viewerId}` : '';
        const res = await fetch(`${API_URL}/posts/${postId}/comments${query}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
    },

    // Group Chat
    getGroupMessages: async (groupId: string) => {
        const res = await fetch(`${API_URL}/groups/${groupId}/messages`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
    },

    sendGroupMessage: async (groupId: string, userId: string, content: string) => {
        const res = await fetch(`${API_URL}/groups/${groupId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, content })
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    },

    // Group Management
    joinGroup: async (groupId: string, userId: string) => {
        const res = await fetch(`${API_URL}/groups/${groupId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to join group');
        return res.json();
    },

    leaveGroup: async (groupId: string, userId: string) => {
        const res = await fetch(`${API_URL}/groups/${groupId}/leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error('Failed to leave group');
        return res.json();
    },

    requestJoinGroup: async (groupId: string, userId: string, message?: string) => {
        const res = await fetch(`${API_URL}/groups/${groupId}/request-join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, message })
        });
        if (!res.ok) throw new Error('Failed to request to join group');
        return res.json();
    },

    getGroupJoinRequests: async (groupId: string, userId: string) => {
        const res = await fetch(`${API_URL}/groups/${groupId}/join-requests?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch join requests');
        return res.json();
    },

    approveJoinRequest: async (requestId: string, reviewerId: string) => {
        const res = await fetch(`${API_URL}/groups/join-requests/${requestId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewerId })
        });
        if (!res.ok) throw new Error('Failed to approve join request');
        return res.json();
    },

    rejectJoinRequest: async (requestId: string, reviewerId: string) => {
        const res = await fetch(`${API_URL}/groups/join-requests/${requestId}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewerId })
        });
        if (!res.ok) throw new Error('Failed to reject join request');
        return res.json();
    },

    // Generic Chat/Discussions
    getDiscussions: async (userId: string) => {
        const res = await fetch(`${API_URL}/discussions?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch discussions');
        return res.json();
    },

    getDiscussionMessages: async (discussionId: string) => {
        const res = await fetch(`${API_URL}/discussions/${discussionId}/messages`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
    },

    sendDiscussionMessage: async (discussionId: string, userId: string, content: string) => {
        const res = await fetch(`${API_URL}/discussions/${discussionId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, content })
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    },

    createDiscussion: async (participants: string[], createdBy: string, title?: string, groupId?: string) => {
        const res = await fetch(`${API_URL}/discussions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participants, title, createdBy, groupId })
        });
        if (!res.ok) throw new Error('Failed to create discussion');
        return res.json();
    },

    register: async (data: any) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Registration failed');
        }
        return res.json();
    },

    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Login failed');
        }
        return res.json();
    }
};
