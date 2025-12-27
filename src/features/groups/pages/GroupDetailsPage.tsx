import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Users, Lock, Globe, Settings, Share2,
    MessageSquare, Calendar, Info, Home, GraduationCap,
    Heart, Trophy, Crown, Shield, MoreHorizontal
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useGroupStore } from '../store/useGroupStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { GroupMemberList } from '../components/GroupMemberList';
import { GroupType } from '../types';
import { mockGroups } from '../data/mockData';

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

type TabType = 'feed' | 'members' | 'about';

export const GroupDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { activeGroup, setActiveGroup, groups, setGroups, joinGroup, leaveGroup } = useGroupStore();
    const [activeTab, setActiveTab] = useState<TabType>('feed');

    useEffect(() => {
        // Load groups if empty
        if (groups.length === 0) {
            setGroups(mockGroups);
        }
    }, [groups.length, setGroups]);

    useEffect(() => {
        // Find and set active group
        const group = groups.find(g => g.id === id);
        if (group) {
            setActiveGroup(group);
        }
        return () => setActiveGroup(null);
    }, [id, groups, setActiveGroup]);

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

    const handleJoinLeave = () => {
        if (!user) return;
        if (isMember) {
            leaveGroup(activeGroup.id, user.id);
        } else {
            joinGroup(activeGroup.id, user);
        }
    };

    const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
        { key: 'feed', label: 'Publications', icon: MessageSquare },
        { key: 'members', label: 'Membres', icon: Users },
        { key: 'about', label: 'À propos', icon: Info }
    ];

    return (
        <div className="max-w-5xl mx-auto pb-10">
            {/* Back Button */}
            <button
                onClick={() => navigate('/groups')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour aux groupes
            </button>

            {/* Cover & Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Member avatars */}
                        <GroupMemberList members={activeGroup.members.slice(0, 5)} compact />
                    </div>
                    <div className="flex items-center gap-2">
                        {memberRole && (
                            <span className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full ${memberRole === 'admin' ? 'bg-amber-100 text-amber-700' :
                                    memberRole === 'moderator' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {memberRole === 'admin' && <Crown className="h-4 w-4" />}
                                {memberRole === 'moderator' && <Shield className="h-4 w-4" />}
                                {memberRole === 'admin' ? 'Admin' : memberRole === 'moderator' ? 'Modérateur' : 'Membre'}
                            </span>
                        )}
                        {!isAdmin && (
                            <Button
                                variant={isMember ? 'outline' : 'default'}
                                onClick={handleJoinLeave}
                                className={isMember ? 'hover:text-red-600 hover:border-red-300' : 'bg-blue-600 hover:bg-blue-700'}
                            >
                                {isMember ? 'Quitter le groupe' : 'Rejoindre'}
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

                {/* Tabs */}
                <div className="px-6 border-b border-gray-100">
                    <div className="flex gap-1">
                        {tabs.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {/* Feed Tab */}
                {activeTab === 'feed' && (
                    <div className="space-y-4">
                        {activeGroup.posts.length > 0 ? (
                            activeGroup.posts.map(post => (
                                <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                    {/* Post Header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={post.author.avatarUrl || `https://ui-avatars.com/api/?name=${post.author.firstName}+${post.author.lastName}&background=random`}
                                            alt={`${post.author.firstName} ${post.author.lastName}`}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {post.author.firstName} {post.author.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-full">
                                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

                                    {post.imageUrl && (
                                        <img
                                            src={post.imageUrl}
                                            alt="Post"
                                            className="mt-3 rounded-lg w-full max-h-96 object-cover"
                                        />
                                    )}

                                    {/* Poll */}
                                    {post.poll && (
                                        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                                            <p className="font-medium mb-3">{post.poll.question}</p>
                                            <div className="space-y-2">
                                                {post.poll.options.map(option => {
                                                    const percentage = Math.round((option.votes / post.poll!.totalVotes) * 100);
                                                    return (
                                                        <div key={option.id} className="relative">
                                                            <div
                                                                className="absolute inset-0 bg-blue-100 rounded-lg"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                            <div className="relative flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-white/50">
                                                                <span>{option.label}</span>
                                                                <span className="text-sm font-medium">{percentage}%</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">{post.poll.totalVotes} votes</p>
                                        </div>
                                    )}

                                    {/* Post Stats */}
                                    <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                                        <span>❤️ {post.likesCount}</span>
                                        <span>💬 {post.commentsCount}</span>
                                        {post.sharesCount > 0 && <span>🔄 {post.sharesCount}</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Aucune publication pour le moment.</p>
                                {isMember && (
                                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                                        Créer une publication
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
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
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-600">{activeGroup.description}</p>
                        </div>

                        {/* Academic Info for class groups */}
                        {activeGroup.type === 'class' && (
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
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
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-purple-600" />
                                    Club parent
                                </h3>
                                <Link
                                    to={`/clubs/${activeGroup.parentClubId}`}
                                    className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <div className="p-2 bg-purple-200 rounded-lg">
                                        <Trophy className="h-5 w-5 text-purple-700" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-purple-900">{activeGroup.parentClubName}</p>
                                        <p className="text-sm text-purple-600">Voir le club →</p>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Rules */}
                        {activeGroup.rules && activeGroup.rules.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3">Règles du groupe</h3>
                                <ul className="space-y-2">
                                    {activeGroup.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-600">
                                            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5">
                                                {index + 1}
                                            </span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Creation Info */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-3">Informations</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    Créé le {new Date(activeGroup.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Crown className="h-4 w-4" />
                                    Créé par {activeGroup.createdBy.firstName} {activeGroup.createdBy.lastName}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
