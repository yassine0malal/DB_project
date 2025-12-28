import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileAbout, ProfileNarrative } from '../components/ProfileAbout';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ArrowLeft, Clock } from 'lucide-react';
import { usePostStore } from '../../feed/store/usePostStore';
import { PostCard } from '../../feed/components/PostCard';

export const ProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuthStore();
    const { profile, fetchProfile, isLoading } = useProfileStore();
    const { posts } = usePostStore();

    // Determine which user to show
    const effectiveUserId = id || currentUser?.id;
    const isOwnProfile = !id || id === currentUser?.id;

    useEffect(() => {
        if (effectiveUserId) {
            fetchProfile(effectiveUserId);
        }
    }, [effectiveUserId, fetchProfile]);

    const user = isOwnProfile ? (profile || currentUser) : profile;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full animate-pulse">
                    <Clock className="h-12 w-12 text-red-500 dark:text-red-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">Utilisateur introuvable</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">Nous n'avons pas pu trouver le profil que vous recherchez. Il se peut qu'il ait été supprimé ou que le lien soit erroné.</p>
                </div>
                <Link to="/">
                    <Button variant="default" className="shadow-lg shadow-blue-500/20">Retour à l'accueil</Button>
                </Link>
            </div>
        );
    }

    const userPosts = posts.filter(post => post.author.id === user.id);

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link to="/">
                <Button variant="ghost" size="sm" className="mb-2 gap-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Retour au fil d'actualité
                </Button>
            </Link>

            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* 1. Sidebar (Metadata & Details) */}
                <div className="lg:col-span-1 space-y-8">
                    <ProfileAbout user={user} isOwnProfile={isOwnProfile} />
                </div>

                {/* 2. Main Content (Narrative & Activities) */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Bio, Projects, etc. */}
                    <ProfileNarrative user={user} />

                    {/* Posts Feed */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight uppercase">Activités récentes</h2>
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                {userPosts.length} Publications
                            </Badge>
                        </div>

                        <div className="space-y-8">
                            {userPosts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                            {userPosts.length === 0 && (
                                <Card className="border-dashed bg-gray-50/50 dark:bg-gray-800/20 dark:border-gray-700 border-2">
                                    <div className="p-16 text-center space-y-3">
                                        <div className="flex justify-center">
                                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        </div>
                                        <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">Aucune publication récente.</p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
