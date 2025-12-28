import { create } from 'zustand';
import { Post, Reply } from '../types';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../auth/store/useAuthStore';

type FeedFilter = 'all' | 'popular' | 'department';

interface PostState {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
    filter: FeedFilter;
    setFilter: (filter: FeedFilter) => void;
    fetchPosts: (viewerId?: string) => Promise<void>;
    addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'isLiked'> & { authorId: string, groupId?: string, clubId?: string }) => Promise<void>;
    addComment: (postId: string, content: string) => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
    getFilteredPosts: (userDepartment?: string) => Post[];
    addReply: (postId: string, commentId: string, reply: Reply) => void;
    deleteComment: (postId: string, commentId: string) => void;
    sharePost: (postId: string) => void;
    votePoll: (postId: string, optionId: string) => void;

    // Non-network actions or simple state
    reportContent: (targetId: string, type: 'post' | 'comment', reason: string) => void;
    deletePost: (postId: string) => void;
}

export const usePostStore = create<PostState>((set, get) => {
    return {
        posts: [],
        isLoading: false,
        error: null,
        filter: 'all',

        setFilter: (filter) => set({ filter }),

        fetchPosts: async (viewerId) => {
            set({ isLoading: true, error: null });
            try {
                const { posts } = await api.getPosts(viewerId);
                set({ posts: posts, isLoading: false });
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

        addPost: async (postData: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'isLiked'> & { authorId: string, groupId?: string, clubId?: string }) => {
            try {
                // Optimistic Update
                const tempId = `temp-${Date.now()}`;
                const newPost: Post = {
                    id: tempId,
                    createdAt: new Date().toISOString(),
                    likesCount: 0,
                    commentsCount: 0,
                    sharesCount: 0,
                    isLiked: false,
                    ...postData,
                    // We need author details for UI, ideally passed or fetched
                    author: {
                        id: postData.authorId,
                        firstName: 'Moi', // Placeholder till refresh
                        lastName: '',
                        role: 'student',
                        avatarUrl: ''
                    }
                } as any;

                set((state) => ({ posts: [newPost, ...state.posts] }));

                await api.createPost(postData);

                // Refresh to get real ID and server data
                const viewerId = useAuthStore.getState().user?.id;
                await get().fetchPosts(viewerId);

            } catch (error) {
                console.error(error);
                // Rollback?
            }
        },

        toggleLike: async (postId) => {
            // Optimistic Update
            set((state) => {
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
            });

            try {
                const userId = useAuthStore.getState().user?.id;
                if (!userId) throw new Error("Not logged in");
                await api.toggleLike(postId, userId);
            } catch (error) {
                console.error(error);
                // Rollback would go here
            }
        },

        addComment: async (postId, content) => {
            try {
                const userId = useAuthStore.getState().user?.id;
                if (!userId) throw new Error("Not logged in");

                const comment = await api.createComment(postId, userId, content);

                set((state) => {
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
                });
            } catch (error) {
                console.error(error);
            }
        },

        addReply: (postId, commentId, reply) => {
            console.log('Reply added (local only)', postId, commentId, reply);
            set((state) => {
                const newPosts = state.posts.map(p => {
                    if (p.id === postId && p.comments) {
                        const newComments = p.comments.map(c => {
                            if (c.id === commentId) {
                                return { ...c, replies: [...(c.replies || []), reply] };
                            }
                            return c;
                        });
                        return { ...p, comments: newComments, commentsCount: p.commentsCount + 1 };
                    }
                    return p;
                });
                return { posts: newPosts };
            });
        },

        deleteComment: (postId, commentId) => set((state) => {
            const newPosts = state.posts.map(p => {
                if (p.id === postId && p.comments) {
                    const filteredComments = p.comments.filter(c => c.id !== commentId);
                    return { ...p, comments: filteredComments, commentsCount: p.commentsCount - 1 };
                }
                return p;
            });
            return { posts: newPosts };
        }),

        sharePost: (postId) => {
            set((state) => {
                const newPosts = state.posts.map(p => {
                    if (p.id === postId) {
                        return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
                    }
                    return p;
                });
                return { posts: newPosts };
            });
        },

        votePoll: (postId, optionId) => {
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

        reportContent: (targetId, type, reason) => {
            console.log(`Reported ${type} ${targetId}: ${reason}`);
            alert("Contenu signalé aux administrateurs. Merci de votre vigilance.");
        },

        deletePost: (postId) => set((state) => ({
            posts: state.posts.filter(p => p.id !== postId)
        })),
    };
});
