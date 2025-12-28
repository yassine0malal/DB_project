import { useState } from 'react';
import { User } from '../../auth/types';
import { Button } from '../../../components/ui/button';
import { Mail, Edit, MapPin, GraduationCap, UserPlus, UserMinus } from 'lucide-react';
import { ProfileEditDialog } from './ProfileEditDialog';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { cn } from '../../../utils/cn';

export const ProfileHeader = ({ user, isOwnProfile }: { user: User; isOwnProfile: boolean }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { user: currentUser, followUser, unfollowUser } = useAuthStore();

    const isFollowing = currentUser?.following?.includes(user.id);

    const getSubtitle = () => {
        if (user.role === 'student') return `${user.level} • ${user.major}`;
        if (user.role === 'teacher') return `${user.title} • ${user.department}`;
        if (user.role === 'admin') return `${user.adminRole} • ${user.department}`;
        return '';
    };

    return (

            <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                    {/* Cover Image */}
                    <div className="h-48 md:h-72 bg-gray-100 dark:bg-gray-900 relative overflow-hidden group">
                        {user.coverUrl ? (
                            <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 animate-gradient-xy" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="px-6 md:px-10 pb-8 relative">
                        <div className="flex flex-col md:flex-row justify-between items-end -mt-20 md:-mt-16 mb-6">
                            {/* Avatar */}
                            <div className="relative group/avatar">
                                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full ring-[6px] ring-white dark:ring-gray-800 bg-white dark:bg-gray-800 overflow-hidden shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-4xl font-black">
                                            {user.firstName[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-black rounded-full border-[3px] border-white dark:border-gray-800 shadow-lg uppercase tracking-wider backdrop-blur-md">
                                    {user.role}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6 md:mt-0 pb-2">
                                {isOwnProfile ? (
                                    <Button variant="outline" className="gap-2 rounded-xl px-5 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 transition-all hover:shadow-md" onClick={() => setIsEditOpen(true)}>
                                        <Edit className="h-4 w-4" />
                                        <span>Modifier mon profil</span>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant={isFollowing ? "outline" : "default"}
                                            className={cn(
                                                "gap-2 px-6 rounded-xl shadow-lg transition-all active:scale-95",
                                                isFollowing
                                                    ? "text-red-500 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                                            )}
                                            onClick={() => isFollowing ? unfollowUser(user.id) : followUser(user.id)}
                                        >
                                            {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                            <span className="font-bold">{isFollowing ? 'Se désabonner' : 'Suivre'}</span>
                                        </Button>
                                        <Button variant="outline" className="gap-2 px-5 rounded-xl dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                            <Mail className="h-4 w-4" />
                                            <span>Message</span>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                            <div className="flex-1 space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
                                        {user.firstName} {user.lastName}
                                        {user.role === 'teacher' && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Vérifié" />}
                                    </h1>
                                    <p className="text-lg text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide opacity-90">{getSubtitle()}</p>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm">
                                    <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition-colors hover:bg-white dark:hover:bg-gray-700/50">
                                        <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                    {user.role === 'teacher' && (
                                        <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                                            <MapPin className="h-4 w-4 text-orange-500" />
                                            <span className="font-medium">{user.officeLocation}</span>
                                        </div>
                                    )}
                                    {user.role === 'student' && (
                                        <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                                            <GraduationCap className="h-4 w-4 text-indigo-500" />
                                            <span className="font-bold tracking-wider">{user.studentId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-[22px] border border-gray-100 dark:border-gray-800 shrink-0 self-start md:self-center shadow-inner">
                                <div className="text-center px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105 cursor-pointer">
                                    <p className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-none">{user.followers?.length || 0}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-2 px-1">Abonnés</p>
                                </div>
                                <div className="text-center px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105 cursor-pointer">
                                    <p className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-none">{user.following?.length || 0}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-2 px-1">Abonnements</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ProfileEditDialog
                    user={user}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            </>
            );
};
