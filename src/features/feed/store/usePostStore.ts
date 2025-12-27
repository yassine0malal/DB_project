import { create } from 'zustand';
import { Post, Comment, Reply } from '../types';
import { localDB } from '../../../lib/localDB';

type FeedFilter = 'all' | 'popular' | 'department';

interface PostState {
    posts: Post[];
    filter: FeedFilter;
    setFilter: (filter: FeedFilter) => void;
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
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
    posts: localDB.get().posts,
    filter: 'all',

    setFilter: (filter) => set({ filter }),

    setPosts: (posts) => {
        set({ posts });
        localDB.save({ posts });
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

    addPost: (post) => set((state) => {
        const newPosts = [post, ...state.posts];
        localDB.save({ posts: newPosts });
        return { posts: newPosts };
    }),

    votePoll: (postId, optionId) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId && p.poll) {
                // Remove previous vote if any
                const prevVote = p.poll.userVote;
                let options = p.poll.options.map(opt => ({ ...opt }));

                if (prevVote === optionId) return p; // Same vote, do nothing (or could toggle off)

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
        localDB.save({ posts: newPosts });
        return { posts: newPosts };
    }),

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
        localDB.save({ posts: newPosts });
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
        localDB.save({ posts: newPosts });
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
        localDB.save({ posts: newPosts });
        return { posts: newPosts };
    }),

    sharePost: (postId) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId) {
                return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
            }
            return p;
        });
        localDB.save({ posts: newPosts });
        return { posts: newPosts };
    }),

    reportContent: (targetId, type, reason) => {
        // In a real app, this would send to API.
        // For local demo, we just log it or could store in a separate 'reports' collection if we wanted.
        console.log(`Reported ${type} ${targetId}: ${reason}`);
        alert("Contenu signalé aux administrateurs. Merci de votre vigilance.");
    },

    deletePost: (postId) => set((state) => {
        const newPosts = state.posts.filter(p => p.id !== postId);
        localDB.save({ posts: newPosts });
        return { posts: newPosts };
    }),

    deleteComment: (postId, commentId) => set((state) => {
        const newPosts = state.posts.map(p => {
            if (p.id === postId && p.comments) {
                // Filter out the comment or check if it's a reply
                const filteredComments = p.comments.filter(c => c.id !== commentId).map(c => {
                    // Also check replies and remove if matches
                    if (c.replies) {
                        return {
                            ...c,
                            replies: c.replies.filter(r => r.id !== commentId)
                        };
                    }
                    return c;
                });

                // Calculate new comment count
                const removedFromMain = p.comments.some(c => c.id === commentId);
                const removedFromReplies = p.comments.some(c => c.replies?.some(r => r.id === commentId));
                const countChange = (removedFromMain || removedFromReplies) ? -1 : 0;

                return {
                    ...p,
                    comments: filteredComments,
                    commentsCount: Math.max(0, p.commentsCount + countChange)
                };
            }
            return p;
        });
        localDB.save({ posts: newPosts });
        return { posts: newPosts };
    })
}));
