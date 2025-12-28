import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Send, MoreVertical, Flag, Trash2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Comment, Reply } from '../types';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownItem } from '../../../components/ui/dropdown-menu';
import { ReportModal } from './ReportModal';

interface CommentItemProps {
    comment: Comment | Reply;
    postId: string; // Add postId prop
    isReply?: boolean;
}

export const CommentItem = ({ comment, postId, isReply = false }: CommentItemProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(comment.likesCount);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);

    const { addReply, deleteComment } = usePostStore();
    const { user } = useAuthStore();

    const isAuthor = user?.id === comment.author.id;
    const isAdmin = user?.role === 'admin';

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleReply = () => {
        if (!replyContent.trim() || !user) return;

        const newReply: Reply = {
            id: Date.now().toString(),
            content: replyContent,
            author: user,
            createdAt: new Date().toISOString(),
            likesCount: 0
        };

        addReply(postId, comment.id, newReply);
        setReplyContent("");
        setIsReplying(false);
    };

    const handleDelete = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
            deleteComment(postId, comment.id);
        }
    };

    return (
        <>
            <div className={cn("flex gap-3 group", isReply ? "mt-3" : "mt-4")}>
                <div className={cn("rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden", isReply ? "h-6 w-6" : "h-8 w-8")}>
                    {comment.author.avatarUrl ? (
                        <img src={comment.author.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300">{comment.author.firstName[0]}</span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-start gap-2">
                        <div className="bg-gray-100/80 dark:bg-gray-700/60 rounded-2xl px-3 py-2 flex-1 max-w-full">
                            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">
                                {comment.author.firstName} {comment.author.lastName}
                            </p>
                            <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-snug">{comment.content}</p>
                        </div>

                        {/* More Options Dropdown */}
                        <DropdownMenu trigger={
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-3 w-3" />
                            </Button>
                        }>
                            {(isAuthor || isAdmin) && (
                                <DropdownItem onClick={handleDelete} destructive className="flex items-center gap-2">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Supprimer
                                </DropdownItem>
                            )}
                            <DropdownItem onClick={() => setShowReportModal(true)} className="flex items-center gap-2">
                                <Flag className="h-3.5 w-3.5" />
                                Signaler
                            </DropdownItem>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4 mt-0.5 px-2">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        <button
                            onClick={handleLike}
                            className={cn("text-[10px] font-bold hover:underline transition-colors", isLiked ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")}
                        >
                            J'aime {likes > 0 && `(${likes})`}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:underline"
                            >
                                Répondre
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <div className="mt-2 flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
                            <Input
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Répondre à ${comment.author.firstName}...`}
                                className="h-7 text-xs bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                                autoFocus
                            />
                            <button
                                onClick={handleReply}
                                disabled={!replyContent.trim()}
                                className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}

                    {!isReply && 'replies' in comment && comment.replies && comment.replies.length > 0 && (
                        <div className="border-l border-gray-200 dark:border-gray-700 ml-1 pl-4">
                            {comment.replies.map(reply => (
                                <CommentItem key={reply.id} comment={reply} postId={postId} isReply />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetId={comment.id}
                type="comment"
            />
        </>
    );
};
