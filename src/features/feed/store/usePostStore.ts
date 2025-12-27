import { create } from 'zustand';
import { Post, Comment, Reply } from '../types';

const API_URL = 'http://localhost:3000/api';

type FeedFilter = 'all' | 'popular' | 'department';

interface PostState {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
    filter: FeedFilter;
    setFilter: (filter: FeedFilter) => void;
    fetchPosts: () => Promise<void>;
    addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'sharesCount'> & { authorId: string, groupId?: string, clubId?: string }) => Promise<void>;
    // Keep other actions as placeholders or optimistic updates for now
    setPosts: (posts: Post[]) => void;
    addComment: (postId: string, comment: Comment) => void;
    addReply: (postId: string, commentId: string, reply: Reply) => void;
    toggleLike: (postId: string) => void;
    sharePost: (postId: string) => void;
    reportContent: (targetId: string, type: 'post' | 'comment', reason: string) => void;
    deletePost: (postId: string) => void;
    deleteComment: (postId: string, commentId: string) => void;
    votePoll: (postId: string, optionId: string) => void;
    getFilteredPosts: (userDepartment?: string) => Post[];
}

export const usePostStore = create<PostState>((set, get) => ({
    posts: [],
    isLoading: false,
    error: null,
    filter: 'all',

    setFilter: (filter) => set({ filter }),

    setPosts: (posts) => set({ posts }),

    fetchPosts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/posts`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            set({ posts: data.posts, isLoading: false });
        } catch (error) {
            console.error(error);
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    getFilteredPosts: (userDepartment) => {
        const { posts, filter } = get();
        let filtered = [...posts];

        if (filter === 'department' && userDepartment) {
            filtered = filtered.filter(p => (p.author as any).department === userDepartment);
        }

        if (filter === 'popular') {
            filtered.sort((a, b) => b.likesCount - a.likesCount);
        } else {
            // Default: Latest/All
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return filtered;
    },

    addPost: async (postData) => {
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
            if (!response.ok) throw new Error('Failed to create post');
            const newPost = await response.json();

            // Optimistic update or refetch
            // For now, let's just refetch or manually add to state if response is full Post
            // Since response is partial, we need to handle it.
            // Simplified:
            get().fetchPosts();
        } catch (error) {
            console.error(error);
        }
    },

    votePoll: (postId, optionId) => {
        // Optimistic update
        set((state) => {
            const newPosts = state.posts.map(p => {
                if (p.id === postId && p.poll) {
                    const prevVote = p.poll.userVote;
                    let options = p.poll.options.map(opt => ({ ...opt }));

                    if (prevVote === optionId) return p;

                    if (prevVote) {
                        options = options.map(opt =>
                            opt.id === prevVote ? { ...opt, votes: opt.votes - 1 } : opt
                        );
                    }

                    options = options.map(opt =>
                        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                    );

                    return {
                        ...p,
                        poll: {
                            ...p.poll,
                            options,
                            userVote: optionId,
                            totalVotes: prevVote ? p.poll.totalVotes : p.poll.totalVotes + 1
                        }
                    };
                }
                return p;
            });
            return { posts: newPosts };
        });
    },

    addComment: (postId, comment) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    commentsCount: p.commentsCount + 1,
                    comments: [...(p.comments || []), comment]
                };
            }
            return p;
        });
        return { posts: newPosts };
    }),

    addReply: (postId, commentId, reply) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId && p.comments) {
                const newComments = p.comments.map(c => {
                    if (c.id === commentId) {
                        return {
                            ...c,
                            replies: [...(c.replies || []), reply]
                        };
                    }
                    return c;
                });
                return { ...p, comments: newComments, commentsCount: p.commentsCount + 1 };
            }
            return p;
        });
        return { posts: newPosts };
    }),

    toggleLike: (postId) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId) {
                const isLiked = !p.isLiked;
                return {
                    ...p,
                    isLiked,
                    likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
                };
            }
            return p;
        });
        return { posts: newPosts };
    }),

    sharePost: (postId) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId) {
                return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
            }
            return p;
        });
        return { posts: newPosts };
    }),

    reportContent: (targetId, type, reason) => {
        console.log(`Reported ${type} ${targetId}: ${reason}`);
        alert("Contenu signalé aux administrateurs. Merci de votre vigilance.");
    },

    deletePost: (postId) => set((state) => {
        const newPosts = state.posts.filter(p => p.id !== postId);
        return { posts: newPosts };
    }),

    deleteComment: (postId, commentId) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId && p.comments) {
                const filteredComments = p.comments.filter(c => c.id !== commentId).map(c => {
                    if (c.replies) {
                        return {
                            ...c,
                            replies: c.replies.filter(r => r.id !== commentId)
                        };
                    }
                    return c;
                });
                return { ...p, comments: filteredComments };
            }
            return p;
        });
        return { posts: newPosts };
    })
}));

