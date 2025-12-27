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
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {/* Cover Image */}
                <div className="h-48 md:h-64 bg-gray-200 relative">
                    {user.coverUrl ? (
                        <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                    )}
                </div>

                <div className="px-6 md:px-8 pb-6 relative">
                    <div className="flex flex-col md:flex-row justify-between items-end -mt-16 md:-mt-12 mb-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-md">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-bold">
                                        {user.firstName[0]}
                                    </div>
                                )}
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full border-2 border-white capitalize">
                                {user.role}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 md:mt-0">
                            {isOwnProfile ? (
                                <Button variant="outline" className="gap-2" onClick={() => setIsEditOpen(true)}>
                                    <Edit className="h-4 w-4" />
                                    Modifier le profil
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant={isFollowing ? "outline" : "default"}
                                        className={cn("gap-2 shadow-sm", isFollowing && "text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600")}
                                        onClick={() => isFollowing ? unfollowUser(user.id) : followUser(user.id)}
                                    >
                                        {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                        {isFollowing ? 'Se désabonner' : 'Suivre'}
                                    </Button>
                                    <Button variant="outline" className="gap-2 shadow-sm">
                                        <Mail className="h-4 w-4" />
                                        Message
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mt-4">
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-lg text-blue-600 font-semibold mt-1">{getSubtitle()}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {user.email}
                                </div>
                                {user.role === 'teacher' && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        {user.officeLocation}
                                    </div>
                                )}
                                {user.role === 'student' && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                        {user.studentId}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm shrink-0 self-start md:self-center">
                            <div className="text-center px-4">
                                <p className="text-2xl font-black text-gray-900">{user.followers?.length || 0}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Abonnés</p>
                            </div>
                            <div className="w-px h-10 bg-gray-100 self-center" />
                            <div className="text-center px-4">
                                <p className="text-2xl font-black text-gray-900">{user.following?.length || 0}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Abonnements</p>
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
