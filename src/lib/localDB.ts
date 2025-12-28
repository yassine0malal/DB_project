import { Post } from '../features/feed/types';
import { Club } from '../features/clubs/types';
import { Group } from '../features/groups/types';

const STORAGE_KEY = 'uni_social_db';

interface DB {
    posts: Post[];
    clubs: Club[];
    groups: Group[];
}

export const localDB = {
    get: (): DB => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { posts: [], clubs: [], groups: [] };
    },

    save: (data: Partial<DB>) => {
        const current = localDB.get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
    },

    seed: (initialPosts: Post[] = [], initialClubs: Club[] = [], initialGroups: Group[] = []) => {
        const current = localDB.get();
        const updates: Partial<DB> = {};

        if (current.posts.length === 0 && initialPosts.length > 0) {
            updates.posts = initialPosts;
        }
        if (current.clubs.length === 0 && initialClubs.length > 0) {
            updates.clubs = initialClubs;
        }
        if (current.groups.length === 0 && initialGroups.length > 0) {
            updates.groups = initialGroups;
        }

        if (Object.keys(updates).length > 0) {
            localDB.save(updates);
        }
    }
};
