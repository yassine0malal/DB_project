import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileAbout, ProfileNarrative } from '../components/ProfileAbout';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { ArrowLeft, Clock } from 'lucide-react';
import { MOCK_USERS } from '../../auth/data/mockUsers';
import { usePostStore } from '../../feed/store/usePostStore';
import { PostCard } from '../../feed/components/PostCard';

export const ProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuthStore();
    const { posts } = usePostStore();

    // Find the user to display
    // If id is provided, look in MOCK_USERS or check if it's the currentUser
    const user = id
        ? MOCK_USERS.find(u => u.id === id) || (id === currentUser?.id ? currentUser : null)
        : currentUser;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="bg-red-50 p-4 rounded-full">
                    <Clock className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Utilisateur introuvable</h2>
                <p className="text-gray-500 max-w-xs">Nous n'avons pas pu trouver le profil que vous recherchez.</p>
                <Link to="/">
                    <Button variant="outline">Retour à l'accueil</Button>
                </Link>
            </div>
        );
    }

    const isOwnProfile = !id || id === currentUser?.id;
    const userPosts = posts.filter(post => post.author.id === user.id);

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
            <Link to="/">
                <Button variant="ghost" size="sm" className="mb-2 gap-2 text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4" />
                    Retour au fil d'actualité
                </Button>
            </Link>

            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* 1. Sidebar (Metadata & Details) */}
                <div className="lg:col-span-1 space-y-6">
                    <ProfileAbout user={user} isOwnProfile={isOwnProfile} />
                </div>

                {/* 2. Main Content (Narrative & Activities) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bio, Projects, etc. */}
                    <ProfileNarrative user={user} />

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 px-1">
                            <div className="h-8 w-1 bg-blue-600 rounded-full" />
                            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase text-sm">Activités récentes</h2>
                        </div>

                        <div className="space-y-6">
                            {userPosts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                            {userPosts.length === 0 && (
                                <Card className="border-dashed bg-gray-50/30">
                                    <div className="p-12 text-center">
                                        <p className="text-gray-400 font-medium">Aucune publication récente.</p>
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
