import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Club } from '../types';

interface ClubCardProps {
    club: Club;
}

export const ClubCard = ({ club }: ClubCardProps) => {
    const [imgError, setImgError] = useState(false);

    return (
        <Card className="overflow-hidden hover:shadow-md transition-all duration-300 group h-full flex flex-col border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <div className="h-32 bg-gray-200 dark:bg-gray-900 relative overflow-hidden">
                {club.coverUrl && !imgError ? (
                    <img
                        src={club.coverUrl}
                        alt={club.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                )}
                {club.logoUrl && (
                    <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-lg border-2 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                        <img src={club.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm border border-white/20 dark:border-gray-700/50">
                    {club.category}
                </div>
            </div>

            <CardHeader className="pt-8 pb-2 px-4">
                <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {club.name}
                </h3>
            </CardHeader>

            <CardContent className="px-4 pb-4 flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 h-10">
                    {club.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{club.membersCount ?? club.members?.length ?? 0} membres</span>
                    </div>
                    {(club.eventsCount && club.eventsCount > 0) || (club.events?.length > 0) ? (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{club.eventsCount ?? club.events.length} événements</span>
                        </div>
                    ) : null}
                </div>
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-0">
                <Link to={`/clubs/${club.id}`} className="w-full">
                    <Button variant="outline" className="w-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-800 bg-transparent">
                        Voir les détails
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};
