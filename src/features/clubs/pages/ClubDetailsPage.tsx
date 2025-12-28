import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useClubStore } from '../store/useClubStore';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { PostCard } from '../../feed/components/PostCard';
import { EventCard } from '../components/EventCard';
import { Settings, Users, Calendar, ArrowLeft, Plus, Mail, Globe, ExternalLink, Shield, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { LazyImage } from '../../../components/ui/LazyImage';

type Tab = 'feed' | 'events' | 'members' | 'about';

export const ClubDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { activeClub, fetchClubDetails, joinClub, leaveClub, isLoading } = useClubStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('feed');

    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (id) {
            fetchClubDetails(id, user?.id);
        }
    }, [id, user?.id]);

    const club = activeClub;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Club introuvable</h2>
                <Link to="/clubs">
                    <Button variant="link" className="text-blue-600 dark:text-blue-400">Retourner à la liste</Button>
                </Link>
            </div>
        );
    }

    const membership = club.members.find(m => m.user.id === user?.id);
    const isMember = !!membership;
    const isClubAdmin = membership?.role === 'admin';
    const isAdmin = user?.role === 'admin';
    const canEdit = isClubAdmin || isAdmin;

    const handleJoinLeave = () => {
        if (!user) return;
        if (isMember) {
            if (confirm("Voulez-vous vraiment quitter ce club ?")) {
                leaveClub(club.id, user.id);
            }
        } else {
            joinClub(club.id, user);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-6">
            <Link to="/clubs">
                <Button variant="ghost" size="sm" className="mb-2 gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux clubs
                </Button>
            </Link>

            {/* Header */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-md">
                {club.coverUrl && !imgError ? (
                    <LazyImage
                        src={club.coverUrl}
                        alt={club.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
                    <div className="text-white w-full flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-semibold backdrop-blur-sm border border-white/10 uppercase tracking-wide">{club.category}</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2 shadow-sm">{club.name}</h1>
                            <p className="flex items-center gap-4 text-sm font-medium opacity-90">
                                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {club.members.length} membres</span>
                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Créé en {new Date(club.createdAt).getFullYear()}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {canEdit && (
                                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm shadow-sm gap-2">
                                    <Settings className="h-4 w-4" />
                                    Gérer
                                </Button>
                            )}
                            <Button
                                onClick={handleJoinLeave}
                                className={cn(
                                    "font-bold shadow-lg transition-all",
                                    isMember ? "bg-red-500 hover:bg-red-600 text-white border-none" : "bg-white text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {isMember ? "Quitter le club" : "Rejoindre le club"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
                {(['feed', 'events', 'members', 'about'] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-900 dark:hover:text-gray-200 transition-colors capitalize",
                            activeTab === tab && "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                        )}
                    >
                        {tab === 'feed' ? 'Flux' : tab === 'events' ? 'Événements' : tab === 'members' ? 'Membres' : 'À propos'}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === 'feed' && (
                    <div className="space-y-6">
                        {isMember && (
                            <Card className="p-4 border-dashed border-2 shadow-none bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
                                    <Plus className="h-5 w-5" />
                                    Publier dans le club
                                </span>
                            </Card>
                        )}
                        {club.posts.length > 0 ? (
                            club.posts.map(post => <PostCard key={post.id} post={post} />)
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">Aucune publication pour le moment.</div>
                        )}
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {club.events.length > 0 ? (
                            club.events.map(event => (
                                // @ts-ignore
                                <EventCard key={event.id} event={event} vertical />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 col-span-full">Aucun événement prévu.</div>
                        )}
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {club.members.map(member => (
                            <Card key={member.user.id} className="p-4 flex items-center justify-between group hover:shadow-md transition-all border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                                            {member.user.avatarUrl ? (
                                                <img src={member.user.avatarUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold">
                                                    {member.user.firstName[0]}
                                                </div>
                                            )}
                                        </div>
                                        {member.role === 'admin' && (
                                            <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-1 shadow-sm border border-white dark:border-gray-800">
                                                <Shield className="h-3 w-3" />
                                            </div>
                                        )}
                                        {member.role === 'moderator' && (
                                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-sm border border-white dark:border-gray-800">
                                                <Edit className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {member.user.firstName} {member.user.lastName}
                                        </h4>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold",
                                                member.role === 'admin' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                                                    member.role === 'moderator' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                                                        "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                            )}>
                                                {member.role}
                                            </span>
                                            • {member.user.role === 'student' ? member.user.major : (member.user as any).department}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                                Description
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                {club.description}
                            </p>
                        </div>

                        {(club.contactEmail || club.website) && (
                            <div>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <div className="h-8 w-1 bg-indigo-600 rounded-full" />
                                    Contact & Liens
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {club.contactEmail && (
                                        <Card className="p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                                            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email</p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{club.contactEmail}</p>
                                            </div>
                                        </Card>
                                    )}
                                    {club.website && (
                                        <a href={club.website} target="_blank" rel="noopener noreferrer">
                                            <Card className="p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                                                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <Globe className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Site Web</p>
                                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                                                        {club.website.replace('https://', '')}
                                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                                    </p>
                                                </div>
                                            </Card>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {club.rules && club.rules.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <div className="h-8 w-1 bg-amber-500 rounded-full" />
                                    Règlement du club
                                </h3>
                                <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-6 border border-amber-100 dark:border-amber-900/30">
                                    <ul className="space-y-3">
                                        {club.rules.map((rule, i) => (
                                            <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300">
                                                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm font-medium">{rule}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
