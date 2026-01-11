import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { UserPlus, User as UserIcon, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Link } from 'react-router-dom';

interface SuggestedUser {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role: string;
    mutualFriends: number;
    isFollowed?: boolean;
}

export const SuggestedUsers = () => {
    const { user } = useAuthStore();
    const [users, setUsers] = useState<SuggestedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!user) return;
            try {
                const response = await fetch(`http://localhost:3000/api/users/suggestions?excludeId=${user.id}`);
                const data = await response.json();
                setUsers(data.suggestions || []);
            } catch (error) {
                console.error('Failed to fetch suggestions', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [user]);

    const handleFollow = async (targetUser: SuggestedUser) => {
        if (!user) return;

        // Optimistic update
        setUsers(users.map(u =>
            u.id === targetUser.id
                ? { ...u, isFollowed: !u.isFollowed }
                : u
        ));

        try {
            const endpoint = `http://localhost:3000/api/users/${targetUser.id}/follow`;
            const method = targetUser.isFollowed ? 'DELETE' : 'POST';

            // For DELETE, some servers prefer params, but our express setup handled query for DELETE or body for POST
            // Let's use fetch options carefuly
            const options: RequestInit = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };

            if (method === 'POST') {
                options.body = JSON.stringify({ userId: user.id });
            } else {
                // DELETE
                // We defined it to use query param ?userId=...
            }

            // Adjust URL for DELETE if needed
            const url = method === 'DELETE'
                ? `${endpoint}?userId=${user.id}`
                : endpoint;

            const res = await fetch(url, options);
            if (!res.ok) throw new Error('Failed to follow/unfollow');

        } catch (error) {
            console.error('Follow action failed', error);
            // Revert optimistic update
            setUsers(users.map(u =>
                u.id === targetUser.id
                    ? { ...u, isFollowed: !u.isFollowed }
                    : u
            ));
        }
    };

    if (isLoading) return <div className="animate-pulse h-40 bg-gray-100 dark:bg-gray-800 rounded-xl" />;


    return (
        <Card className="shadow-sm border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-green-500" />
                    Suggestions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {users.map((suggestedUser) => (
                        <div key={suggestedUser.id} className="flex items-center justify-between">
                            <Link to={`/profile/${suggestedUser.id}`} className="flex items-center gap-2 group cursor-pointer overflow-hidden">
                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0 transition-transform group-hover:scale-105">
                                    {suggestedUser.avatarUrl ? (
                                        <img src={suggestedUser.avatarUrl} alt={suggestedUser.firstName} className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {suggestedUser.firstName} {suggestedUser.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                                        {suggestedUser.role} • {suggestedUser.mutualFriends} amis
                                    </p>
                                </div>
                            </Link>
                            <Button
                                size="icon"
                                variant={suggestedUser.isFollowed ? "default" : "ghost"}
                                className={`h-8 w-8 rounded-full flex-shrink-0 ${suggestedUser.isFollowed ? 'bg-green-500 hover:bg-green-600 text-white' : 'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20'}`}
                                onClick={() => handleFollow(suggestedUser)}
                            >
                                {suggestedUser.isFollowed ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                            </Button>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <p className="text-sm text-gray-500">Aucune suggestion.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
