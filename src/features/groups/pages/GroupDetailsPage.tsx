import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Users, Lock, Globe, Settings, Share2,
    MessageSquare, Calendar, Info, Home, GraduationCap,
    Heart, Trophy, Crown, Shield, MoreHorizontal, FileText, Plus
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useGroupStore } from '../store/useGroupStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { GroupMemberList } from '../components/GroupMemberList';
import { GroupChat } from '../components/GroupChat';
import { GroupType } from '../types';
import { PostCard } from '../../feed/components/PostCard';
import { CreatePostModal } from '../../feed/components/CreatePostModal';
import { api } from '../../../lib/api';

const getGroupTypeInfo = (type: GroupType) => {
    switch (type) {
        case 'friends':
            return { label: 'Groupe d\'amis', icon: Heart, color: 'bg-pink-100 text-pink-700' };
        case 'apartment':
            return { label: 'Colocation', icon: Home, color: 'bg-amber-100 text-amber-700' };
        case 'class':
            return { label: 'Promotion', icon: GraduationCap, color: 'bg-blue-100 text-blue-700' };
        case 'club':
            return { label: 'Sous-groupe club', icon: Trophy, color: 'bg-purple-100 text-purple-700' };
        default:
            return { label: 'Groupe', icon: Users, color: 'bg-gray-100 text-gray-700' };
    }
};

type TabType = 'chat' | 'publications' | 'members' | 'about';

export const GroupDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { activeGroup, setActiveGroup, fetchGroup, joinGroup, leaveGroup, isLoading } = useGroupStore();
    const [activeTab, setActiveTab] = useState<TabType>('chat');
    const [showCreatePost, setShowCreatePost] = useState(false);

    useEffect(() => {
        if (id) {
            fetchGroup(id);
        }
        return () => setActiveGroup(null);
    }, [id, fetchGroup, setActiveGroup]);

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/groups');
        }
    };


    if (!activeGroup) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
                <p className="text-gray-500">Chargement du groupe...</p>
            </div>
        );
    }

    const typeInfo = getGroupTypeInfo(activeGroup.type);
    const TypeIcon = typeInfo.icon;
    const isMember = user && activeGroup.members.some(m => m.user.id === user.id);
    const isAdmin = user && activeGroup.members.some(m => m.user.id === user.id && m.role === 'admin');
    const memberRole = user && activeGroup.members.find(m => m.user.id === user.id)?.role;
    const isPrivate = activeGroup.visibility === 'private';
    const joinRequestStatus = (activeGroup as any).joinRequestStatus; // 'pending', 'approved', 'rejected', or null

    const handleJoinLeave = async () => {
        if (!user) return;

        if (isMember) {
            leaveGroup(activeGroup.id, user.id);
        } else {
            // If private and no request, request to join
            if (isPrivate) {
                try {
                    await api.requestJoinGroup(activeGroup.id, user.id);
                    // Refetch group to get updated request status
                    fetchGroup(activeGroup.id);
                } catch (error) {
                    console.error('Failed to request join:', error);
                }
            } else {
                // Public group - join directly
                joinGroup(activeGroup.id, user);
            }
        }
    };

    // Determine button text and state
    const getJoinButtonConfig = () => {
        if (isMember) {
            return { text: 'Quitter le groupe', disabled: false, variant: 'outline' as const };
        }
        if (isPrivate) {
            if (joinRequestStatus === 'pending') {
                return { text: 'Demande envoyée', disabled: true, variant: 'outline' as const };
            }
            if (joinRequestStatus === 'rejected') {
                return { text: 'Demande refusée', disabled: true, variant: 'outline' as const };
            }
            return { text: 'Demander à rejoindre', disabled: false, variant: 'default' as const };
        }
        return { text: 'Rejoindre', disabled: false, variant: 'default' as const };
    };

    const joinButtonConfig = getJoinButtonConfig();

    const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
        { key: 'chat', label: 'Discussion', icon: MessageSquare },
        { key: 'publications', label: 'Publications', icon: FileText },
        { key: 'members', label: 'Membres', icon: Users },
        { key: 'about', label: 'À propos', icon: Info }
    ];

    return (
        <div className="max-w-5xl mx-auto pb-10">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour
            </button>

            {/* Cover & Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Cover Image */}
                <div className="h-48 md:h-64 relative">
                    <img
                        src={activeGroup.coverUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=400'}
                        alt={activeGroup.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium ${typeInfo.color}`}>
                            <TypeIcon className="h-4 w-4" />
                            {typeInfo.label}
                        </span>
                        {activeGroup.visibility === 'private' ? (
                            <span className="bg-gray-900/70 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Lock className="h-4 w-4" /> Privé
                            </span>
                        ) : (
                            <span className="bg-green-600/80 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Globe className="h-4 w-4" /> Public
                            </span>
                        )}
                    </div>

                    {/* Title on cover */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                            {activeGroup.name}
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-white/90">
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {activeGroup.members.length} membre{activeGroup.members.length > 1 ? 's' : ''}
                            </span>
                            {activeGroup.type === 'club' && activeGroup.parentClubName && (
                                <Link to={`/clubs/${activeGroup.parentClubId}`} className="hover:underline">
                                    ← {activeGroup.parentClubName}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Member avatars */}
                        <GroupMemberList members={activeGroup.members.slice(0, 5)} compact />
                    </div>
                    <div className="flex items-center gap-2">
                        {memberRole && (
                            <span className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full ${memberRole === 'admin' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                memberRole === 'moderator' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                {memberRole === 'admin' && <Crown className="h-4 w-4" />}
                                {memberRole === 'moderator' && <Shield className="h-4 w-4" />}
                                {memberRole === 'admin' ? 'Admin' : memberRole === 'moderator' ? 'Modérateur' : 'Membre'}
                            </span>
                        )}
                        {!isAdmin && (
                            <Button
                                variant={joinButtonConfig.variant}
                                onClick={handleJoinLeave}
                                disabled={joinButtonConfig.disabled}
                                className={isMember ? 'hover:text-red-600 hover:border-red-300' : 'bg-blue-600 hover:bg-blue-700'}
                            >
                                {joinButtonConfig.text}
                            </Button>
                        )}
                        {isAdmin && (
                            <Button variant="outline" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Gérer
                            </Button>
                        )}
                        <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Tabs - only show for members of private groups */}
                {(!isPrivate || isMember) ? (
                    <div className="px-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex gap-1">
                            {tabs.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-center max-w-md mx-auto">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                <Lock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Groupe privé</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Ce groupe est privé. Vous devez être membre pour voir les discussions, publications et la liste des membres.
                            </p>
                            {joinRequestStatus === 'pending' && (
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Votre demande d'adhésion est en cours d'examen par les administrateurs.
                                </p>
                            )}
                            {joinRequestStatus === 'rejected' && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    Votre demande d'adhésion a été refusée.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Tab Content - only show for members of private groups */}
            {(!isPrivate || isMember) && (
                <div className="mt-6">

                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                        <GroupChat groupId={activeGroup.id} isMember={!!isMember} />
                    )}

                    {/* Publications Tab */}
                    {activeTab === 'publications' && (
                        <div className="space-y-4">
                            {/* Create Post Button */}
                            {isMember && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                                    <Button
                                        onClick={() => setShowCreatePost(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Créer une publication
                                    </Button>
                                </div>
                            )}

                            {/* Posts List */}
                            {activeGroup.posts && activeGroup.posts.length > 0 ? (
                                <div className="space-y-4">
                                    {activeGroup.posts.map(post => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center shadow-sm">
                                    <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Aucune publication</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        {isMember
                                            ? "Soyez le premier à publier dans ce groupe !"
                                            : "Ce groupe n'a pas encore de publications."}
                                    </p>
                                    {isMember && (
                                        <Button
                                            onClick={() => setShowCreatePost(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Créer une publication
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">
                                    {activeGroup.members.length} membre{activeGroup.members.length > 1 ? 's' : ''}
                                </h3>
                                {isAdmin && (
                                    <Button variant="outline" size="sm">
                                        Inviter des membres
                                    </Button>
                                )}
                            </div>
                            <GroupMemberList members={activeGroup.members} />
                        </div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            {/* Description */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300">{activeGroup.description}</p>
                            </div>

                            {/* Academic Info for class groups */}
                            {activeGroup.type === 'class' && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        Informations académiques
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {activeGroup.level && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-600 mb-1">Niveau</p>
                                                <p className="font-medium text-blue-900">{activeGroup.level}</p>
                                            </div>
                                        )}
                                        {activeGroup.major && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-600 mb-1">Filière</p>
                                                <p className="font-medium text-blue-900">{activeGroup.major}</p>
                                            </div>
                                        )}
                                        {activeGroup.academicYear && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-600 mb-1">Année académique</p>
                                                <p className="font-medium text-blue-900">{activeGroup.academicYear}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Parent Club for club subgroups */}
                            {activeGroup.type === 'club' && activeGroup.parentClubName && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        Club parent
                                    </h3>
                                    <Link
                                        to={`/clubs/${activeGroup.parentClubId}`}
                                        className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                                    >
                                        <div className="p-2 bg-purple-200 dark:bg-purple-800/50 rounded-lg">
                                            <Trophy className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-purple-900 dark:text-purple-100">{activeGroup.parentClubName}</p>
                                            <p className="text-sm text-purple-600 dark:text-purple-300">Voir le club →</p>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Rules */}
                            {activeGroup.rules && activeGroup.rules.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Règles du groupe</h3>
                                    <ul className="space-y-2">
                                        {activeGroup.rules.map((rule, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5">
                                                    {index + 1}
                                                </span>
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Creation Info */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Informations</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        Créé le {new Date(activeGroup.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Crown className="h-4 w-4" />
                                        Créé par {activeGroup.createdBy.firstName} {activeGroup.createdBy.lastName}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => {
                    setShowCreatePost(false);
                    // Refresh group data after creating a post
                    if (activeGroup) {
                        fetchGroup(activeGroup.id);
                    }
                }}
                groupId={activeGroup.id}
                groupName={activeGroup.name}
            />
        </div>
    );
};
