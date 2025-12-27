import { Crown, Shield, User } from 'lucide-react';
import { GroupMember, GroupRole } from '../types';
import { Link } from 'react-router-dom';

interface GroupMemberListProps {
    members: GroupMember[];
    compact?: boolean;
}

const getRoleInfo = (role: GroupRole) => {
    switch (role) {
        case 'admin':
            return { label: 'Admin', icon: Crown, color: 'text-amber-600 bg-amber-50' };
        case 'moderator':
            return { label: 'Modérateur', icon: Shield, color: 'text-blue-600 bg-blue-50' };
        default:
            return { label: 'Membre', icon: User, color: 'text-gray-600 bg-gray-50' };
    }
};

export const GroupMemberList = ({ members, compact = false }: GroupMemberListProps) => {
    // Sort members: admins first, then moderators, then regular members
    const sortedMembers = [...members].sort((a, b) => {
        const roleOrder = { admin: 0, moderator: 1, member: 2 };
        return roleOrder[a.role] - roleOrder[b.role];
    });

    if (compact) {
        // Compact view: just avatars stacked
        const displayMembers = sortedMembers.slice(0, 5);
        const remaining = sortedMembers.length - 5;

        return (
            <div className="flex items-center">
                <div className="flex -space-x-2">
                    {displayMembers.map((member) => (
                        <img
                            key={member.user.id}
                            src={member.user.avatarUrl || `https://ui-avatars.com/api/?name=${member.user.firstName}+${member.user.lastName}&background=random`}
                            alt={`${member.user.firstName} ${member.user.lastName}`}
                            className="h-8 w-8 rounded-full border-2 border-white object-cover"
                            title={`${member.user.firstName} ${member.user.lastName}`}
                        />
                    ))}
                </div>
                {remaining > 0 && (
                    <span className="ml-2 text-sm text-gray-500">+{remaining} autres</span>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {sortedMembers.map((member) => {
                const roleInfo = getRoleInfo(member.role);
                const RoleIcon = roleInfo.icon;

                return (
                    <Link
                        key={member.user.id}
                        to={`/profile/${member.user.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        {/* Avatar */}
                        <img
                            src={member.user.avatarUrl || `https://ui-avatars.com/api/?name=${member.user.firstName}+${member.user.lastName}&background=random`}
                            alt={`${member.user.firstName} ${member.user.lastName}`}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                                {member.user.firstName} {member.user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {'major' in member.user && member.user.major ? member.user.major : member.user.email}
                            </p>
                        </div>

                        {/* Role Badge */}
                        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${roleInfo.color}`}>
                            <RoleIcon className="h-3 w-3" />
                            {roleInfo.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};
