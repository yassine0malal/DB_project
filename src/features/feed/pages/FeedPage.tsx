import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Image as ImageIcon, Smile, BarChart2 } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { CreatePostModal } from '../components/CreatePostModal';

export const FeedPage = () => {
    const { filter, setFilter, getFilteredPosts, fetchPosts, isLoading } = usePostStore();
    const { user } = useAuthStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const displayPosts = getFilteredPosts((user as any)?.department);

    // Initial Fetch
    useEffect(() => {
        fetchPosts(user?.id);
    }, [fetchPosts, user?.id]);

    if (isLoading) {
        return <div className="text-center py-10">Chargement des publications...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            {/* Create Post Trigger Card */}
            <Card className="shadow-sm border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-all" onClick={() => setIsCreateModalOpen(true)}>
                <CardContent className="p-4 flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 overflow-hidden">
                        {user?.avatarUrl ? <img src={user.avatarUrl} className="h-full w-full object-cover" /> : user?.firstName[0]}
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left">
                        Quoi de neuf, {user?.firstName} ? Commencez une publication...
                    </div>
                </CardContent>
                <div className="px-4 py-3 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-4 ml-2">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-md transition-colors">
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            Photo
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-md transition-colors">
                            <BarChart2 className="h-4 w-4 text-green-500" />
                            Sondage
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                            <Smile className="h-4 w-4 text-yellow-500" />
                            Humeur
                        </div>
                    </div>
                </div>
            </Card>

            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="rounded-full px-4 font-semibold shadow-sm"
                >
                    Tous
                </Button>
                <Button
                    variant={filter === 'popular' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('popular')}
                    className="rounded-full px-4 font-semibold shadow-sm"
                >
                    Populaires 🔥
                </Button>
                {(user as any)?.department && (
                    <Button
                        variant={filter === 'department' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('department')}
                        className="rounded-full px-4 font-semibold shadow-sm"
                    >
                        Mon Département ({(user as any).department})
                    </Button>
                )}
            </div>

            {/* Feed List */}
            <div className="space-y-6">
                {displayPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
                {displayPosts.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">Aucune publication trouvée pour ce filtre.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
