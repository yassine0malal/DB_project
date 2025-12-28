import { Link } from 'react-router-dom';
import { Users, Lock, Globe, Home, GraduationCap, Heart, Trophy } from 'lucide-react';
import { Group, GroupType } from '../types';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useGroupStore } from '../store/useGroupStore';
import { Button } from '../../../components/ui/button';

interface GroupCardProps {
    group: Group;
}

const getGroupTypeInfo = (type: GroupType) => {
    switch (type) {
        case 'friends':
            return { label: 'Amis', icon: Heart, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' };
        case 'apartment':   
            return { label: 'Colocation', icon: Home, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' };
        case 'class':
            return { label: 'Promotion', icon: GraduationCap, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' };
        case 'club':
            return { label: 'Club', icon: Trophy, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' };
        default:
            return { label: 'Groupe', icon: Users, color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' };
    }
};

export const GroupCard = ({ group }: GroupCardProps) => {
    const { user } = useAuthStore();
    const { joinGroup, leaveGroup } = useGroupStore();
    const typeInfo = getGroupTypeInfo(group.type);
    const TypeIcon = typeInfo.icon;

    const isMember = user && group.members.some(m => m.user.id === user.id);
    const isAdmin = user && group.members.some(m => m.user.id === user.id && m.role === 'admin');

    const handleJoinLeave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return;

        if (isMember) {
            leaveGroup(group.id, user.id);
        } else {
            joinGroup(group.id, user);
        }
    };

    return (
        <Link to={`/groups/${group.id}`} className="block h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group h-full flex flex-col">
                {/* Cover Image */}
                <div className="h-32 relative overflow-hidden shrink-0">
                    <img
                        src={group.coverUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600&h=200'}
                        alt={group.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Visibility Badge */}
                    <div className="absolute top-2 right-2">
                        {group.visibility === 'private' ? (
                            <span className="bg-gray-900/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Lock className="h-3 w-3" /> Privé
                            </span>
                        ) : (
                            <span className="bg-green-600/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Globe className="h-3 w-3" /> Public
                            </span>
                        )}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute bottom-2 left-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium ${typeInfo.color}`}>
                            <TypeIcon className="h-3 w-3" />
                            {typeInfo.label}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{group.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 mb-4 flex-1">{group.description}</p>

                    {/* Members & Action */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>{group.members.length} membre{group.members.length > 1 ? 's' : ''}</span>
                        </div>

                        {!isAdmin && (
                            <Button
                                size="sm"
                                variant={isMember ? 'outline' : 'default'}
                                onClick={handleJoinLeave}
                                className={isMember
                                    ? 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 border-gray-200 dark:border-gray-700 bg-transparent'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'}
                            >
                                {isMember ? 'Quitter' : 'Rejoindre'}
                            </Button>
                        )}
                        {isAdmin && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">Admin</span>
                        )}
                    </div>

                    {/* Parent Club Link for subgroups */}
                    {group.type === 'club' && group.parentClubName && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Sous-groupe de <span className="font-medium text-purple-600 dark:text-purple-400">{group.parentClubName}</span>
                            </p>
                        </div>
                    )}

                    {/* Academic Info for class groups */}
                    {group.type === 'class' && group.major && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-wrap">
                            {group.level && (
                                <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">{group.level}</span>
                            )}
                            {group.major && (
                                <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded truncate max-w-[150px]">{group.major}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};
