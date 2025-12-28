import { User } from '../../auth/types';
import { Post } from '../../feed/types';
export * from './discussion';

export type GroupType = 'friends' | 'apartment' | 'class' | 'club';

export type GroupRole = 'admin' | 'moderator' | 'member';

export type GroupVisibility = 'public' | 'private';

export interface GroupMember {
    user: User;
    role: GroupRole;
    joinedAt: string;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    type: GroupType;
    visibility: GroupVisibility;
    coverUrl?: string;
    createdAt: string;
    createdBy: User;
    members: GroupMember[];
    posts: Post[];
    rules?: string[];
    // For class groups
    academicYear?: string;
    major?: string;
    level?: string;
    // For club subgroups
    parentClubId?: string;
    parentClubName?: string;
}

export interface GroupState {
    groups: Group[];
    activeGroup: Group | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        type: GroupType | 'all';
        search: string;
    };
    // Actions
    fetchGroups: () => Promise<void>;
    fetchGroup: (id: string) => Promise<void>;
    setGroups: (groups: Group[]) => void;
    setActiveGroup: (group: Group | null) => void;
    createGroup: (group: Group) => void;
    joinGroup: (groupId: string, user: User) => void;
    leaveGroup: (groupId: string, userId: string) => void;
    setFilter: (key: 'type' | 'search', value: string) => void;
    getFilteredGroups: () => Group[];
}
