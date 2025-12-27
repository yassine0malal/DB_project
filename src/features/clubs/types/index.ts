import { User } from '../../auth/types';
import { Post } from '../../feed/types';

export type ClubRole = 'admin' | 'moderator' | 'member';

export interface ClubMember {
    user: User;
    role: ClubRole;
    joinedAt: string;
}

export interface EventGuest {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
    company?: string;
    linkedInUrl?: string;
}

export interface ClubEvent {
    id: string;
    clubId: string;
    title: string;
    description: string;
    fullDescription?: string; // Markdown supported
    date: string;
    endDate?: string;
    location: string;
    isOnline: boolean;
    meetingUrl?: string;

    // Pricing
    isPaid: boolean;
    price?: number;
    currency?: string;

    // Media
    coverUrl?: string;
    gallery?: string[];

    // People
    organizerId?: string;
    attendees: User[]; // Full User objects
    maxAttendees?: number;
    guests?: EventGuest[];

    // Meta
    status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
    tags: string[];
}

export interface Club {
    id: string;
    name: string;
    description: string;
    category: string; // e.g., 'Sport', 'Tech', 'Art', 'Academic'
    logoUrl?: string;
    coverUrl?: string;
    createdAt: string;
    members: ClubMember[];
    events: ClubEvent[];
    posts: Post[]; // Specific feed for the club
    rules?: string[];
    contactEmail?: string;
    website?: string;
}

export interface ClubState {
    clubs: Club[];
    activeClub: Club | null;
    filters: {
        category: string | 'all';
        search: string;
    };
    // Actions
    setClubs: (clubs: Club[]) => void;
    setActiveClub: (club: Club | null) => void;
    joinClub: (clubId: string, user: User) => void;
    leaveClub: (clubId: string, userId: string) => void;
    createClub: (club: Club) => void;
    addEvent: (clubId: string, event: ClubEvent) => void;
    toggleParticipation: (eventId: string, user: User) => void;
    setFilter: (key: 'category' | 'search', value: string) => void;
    getFilteredClubs: () => Club[];
}
