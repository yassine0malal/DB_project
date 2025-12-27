import { Post } from '../features/feed/types';
import { Club } from '../features/clubs/types';

const STORAGE_KEY = 'uni_social_db';

interface DB {
    posts: Post[];
    clubs: Club[];
}

export const localDB = {
    get: (): DB => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { posts: [], clubs: [] };
    },

    save: (data: Partial<DB>) => {
        const current = localDB.get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
    },

    seed: (initialPosts: Post[]) => {
        const current = localDB.get();
        const updates: Partial<DB> = {};
        if (current.posts.length === 0) {
            updates.posts = initialPosts;
        }
        if (!current.clubs) {
            updates.clubs = [];
        }
        if (Object.keys(updates).length > 0) {
            localDB.save(updates);
        }
    }
};
