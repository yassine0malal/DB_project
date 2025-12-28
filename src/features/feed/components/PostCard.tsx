import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Heart, MessageSquare, Share2, Send, Trash2, Flag, UserPlus, UserMinus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { cn } from '../../../utils/cn';
import { Post } from '../types';
import { CommentItem } from './CommentItem';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useUserStore } from '../../profile/store/useUserStore';
import { DropdownMenu, DropdownItem } from '../../../components/ui/dropdown-menu';
import { ReportModal } from './ReportModal';
import { ShareModal } from './ShareModal';
import { Link } from 'react-router-dom';
import { LazyImage } from '../../../components/ui/LazyImage';

interface PostCardProps {
    post: Post;
    className?: string;
}

export const PostCard = ({ post, className }: PostCardProps) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const { toggleLike, addComment, deletePost, sharePost } = usePostStore();
    const { user: currentUser, followUser, unfollowUser } = useAuthStore();
    const { getUserById } = useUserStore();

    const author = getUserById(post.author.id) || post.author;

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        await addComment(post.id, newComment);
        setNewComment("");
    };

    const handleShare = () => {
        sharePost(post.id);
        setShowShareModal(true);
    };

    const isAuthor = currentUser?.id === author.id;
    const isAdmin = currentUser?.role === 'admin';
    const isFollowing = currentUser?.following?.includes(author.id);

    return (
        <>
            <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md border-gray-200 dark:border-gray-700", className)}>
                <CardHeader className="flex flex-row items-start gap-3 p-4 pb-0">
                    <Link to={`/profile/${author.id}`} className="flex-shrink-0">
                        <div className="h-10 w-10 relative overflow-hidden rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex-shrink-0 cursor-pointer transition-transform hover:scale-110">
                            {author.avatarUrl ? (
                                <img src={author.avatarUrl} alt={author.firstName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                                    {author.firstName[0]}
                                </div>
                            )}
                        </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <Link to={`/profile/${author.id}`}>
                                        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-none hover:text-blue-700 dark:hover:text-blue-400 hover:underline cursor-pointer truncate">
                                            {author.firstName} {author.lastName}
                                        </h3>
                                    </Link>
                                    {!isAuthor && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "h-6 px-2 text-[10px] font-bold rounded-full transition-all",
                                                isFollowing
                                                    ? "text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            )}
                                            onClick={() => isFollowing ? unfollowUser(author.id) : followUser(author.id)}
                                        >
                                            {isFollowing ? (
                                                <>
                                                    <UserMinus className="h-3 w-3 mr-1" />
                                                    Suivi(e)
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="h-3 w-3 mr-1" />
                                                    Suivre
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                                {(author as any).department && (
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium truncate italic">{(author as any).department} • {author.role}</p>
                                )}
                            </div>

                            <DropdownMenu trigger={
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            }>
                                {(isAuthor || isAdmin) && (
                                    <DropdownItem onClick={() => deletePost(post.id)} destructive className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer
                                    </DropdownItem>
                                )}
                                <DropdownItem onClick={() => setShowReportModal(true)} className="flex items-center gap-2">
                                    <Flag className="h-4 w-4" />
                                    Signaler
                                </DropdownItem>
                            </DropdownMenu>

                        </div>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                    {post.imageUrl && (
                        <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 relative group">
                            <LazyImage
                                src={post.imageUrl}
                                alt="Post content"
                                className="w-full h-auto max-h-[500px] object-cover"
                            />
                        </div>
                    )}

                    {post.poll && (
                        <div className="space-y-2 mt-2">
                            {post.poll.options.map((option) => {
                                const percentage = post.poll!.totalVotes > 0
                                    ? Math.round((option.votes / post.poll!.totalVotes) * 100)
                                    : 0;
                                const isVoted = post.poll!.userVote === option.id;

                                return (
                                    <div key={option.id} className="relative group">
                                        <button
                                            onClick={() => usePostStore.getState().votePoll(post.id, option.id)}
                                            className={cn(
                                                "relative w-full text-left py-2 px-3 rounded-md text-sm border transition-all overflow-hidden z-10 hover:border-blue-300 dark:hover:border-blue-600",
                                                isVoted ? "border-blue-500 dark:border-blue-600 font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                            )}
                                        >
                                            <span className="relative z-10 flex justify-between">
                                                <span>{option.label}</span>
                                                <span>{percentage}%</span>
                                            </span>
                                            <div
                                                className={cn("absolute top-0 left-0 h-full transition-all duration-500 ease-out opacity-20", isVoted ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-gray-600")}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                            <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 text-right">
                                {post.poll.totalVotes} votes • {post.poll.endDate ? `Fin le ${new Date(post.poll.endDate).toLocaleDateString()}` : 'En cours'}
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-1 border-t dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
                    <div className="flex items-center w-full px-2 py-0.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(post.id)}
                            className={cn("flex-1 gap-2 rounded-lg transition-all", post.isLiked ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700")}
                        >
                            <Heart className={cn("h-4 w-4 transition-all duration-300", post.isLiked && "fill-current scale-110")} />
                            <span className="text-xs font-bold">{post.likesCount}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowComments(!showComments)}
                            className={cn("flex-1 gap-2 rounded-lg transition-all", showComments ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700")}
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-xs font-bold">{post.commentsCount}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="flex-1 gap-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <Share2 className={cn("h-4 w-4", post.sharesCount > 0 && "text-blue-600")} />
                            <span className={cn("text-xs font-bold", post.sharesCount > 0 && "text-blue-600")}>
                                {post.sharesCount > 0 ? `${post.sharesCount}` : 'Partager'}
                            </span>
                        </Button>
                    </div>

                    {showComments && (
                        <div className="w-full p-4 border-t dark:border-gray-700 bg-gray-50/20 dark:bg-gray-800/50 animate-in fade-in slide-in-from-top-1 duration-300">
                            {/* Input area */}
                            <div className="flex gap-2 mb-4">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 border border-white dark:border-gray-700 shadow-sm flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 overflow-hidden">
                                    {currentUser?.avatarUrl ? <img src={currentUser.avatarUrl} className="h-full w-full object-cover" /> : currentUser?.firstName?.[0]}
                                </div>
                                <div className="flex-1 relative">
                                    <Input
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                        placeholder="Écrire un commentaire..."
                                        className="bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 pr-10 rounded-2xl text-xs h-8 focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:text-gray-300 dark:disabled:text-gray-600 transition-colors"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Comments list */}
                            <div className="space-y-4">
                                {post.comments?.map(comment => (
                                    <CommentItem key={comment.id} comment={comment} postId={post.id} />
                                ))}
                                {(!post.comments || post.comments.length === 0) && (
                                    <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-4 italic">Soyez le premier à commenter cette publication.</p>
                                )}
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetId={post.id}
                type="post"
            />

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title={`Publication de ${author.firstName}`}
                url={`${window.location.origin}/posts/${post.id}`}
            />
        </>
    );
};

