import { MapPin, Clock, Video, Share2, Check } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ClubEvent } from '../types';
import { cn } from '../../../utils/cn';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useClubStore } from '../store/useClubStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { ShareModal } from '../../feed/components/ShareModal';

interface EventCardProps {
    event: ClubEvent;
    clubName?: string;
    vertical?: boolean;
}

export const EventCard = ({ event, clubName, vertical = false }: EventCardProps) => {
    const eventDate = new Date(event.date);
    const { toggleParticipation } = useClubStore();
    const { user } = useAuthStore();
    const [showShareModal, setShowShareModal] = useState(false);

    const isParticipating = user ? event.attendees.some(a => a.id === user.id) : false;

    // Relative time helper (simplified)
    const getRelativeTime = (date: Date) => {
        const diff = date.getTime() - Date.now();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Terminé';
        if (days === 0) return "Aujourd'hui";
        if (days === 1) return 'Demain';
        return `Dans ${days} jours`;
    };

    const [imgError, setImgError] = useState(false);

    return (
        <>
            <Card className={cn(
                "rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group",
                vertical ? "w-full" : "min-w-[320px] max-w-[320px]"
            )}>
                {/* Cover Image & Badges */}
                <div className="relative h-40 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                    {event.coverUrl && !imgError ? (
                        <img
                            src={event.coverUrl}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white/50">
                            <CalendarIcon date={eventDate} />
                        </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant={event.isOnline ? "secondary" : "default"} className="bg-white/90 dark:bg-gray-900/90 text-black dark:text-white shadow-sm backdrop-blur-md hover:bg-white dark:hover:bg-gray-900">
                            {event.isOnline ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                            {event.isOnline ? 'En ligne' : 'Présentiel'}
                        </Badge>
                    </div>

                    <div className="absolute bottom-3 right-3 flex gap-2">
                        <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md">
                            {getRelativeTime(eventDate)}
                        </span>
                    </div>
                </div>

                <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-lg leading-tight line-clamp-1 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {event.title}
                            </h4>
                        </div>
                        {clubName && (
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                {clubName}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {event.isOnline ? <Video className="h-4 w-4 text-gray-400" /> : <MapPin className="h-4 w-4 text-gray-400" />}
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {event.attendees.slice(0, 3).map((attendee, i) => (
                                    <div key={attendee.id || i} className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold text-blue-600 dark:text-blue-400 overflow-hidden shadow-sm">
                                        {attendee.avatarUrl ? <img src={attendee.avatarUrl} className="h-full w-full object-cover" /> : attendee.firstName?.[0]}
                                    </div>
                                ))}
                                {event.attendees.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-500 dark:text-gray-300">
                                        +{event.attendees.length - 3}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                                {event.attendees.length > 0 ? `${event.attendees.length} participants` : 'Soyez le premier !'}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowShareModal(true);
                            }}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                    <Link to={`/events/${event.id}`} className="flex-1 min-w-[120px]">
                        <Button variant="outline" size="sm" className="w-full border-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
                            Détails
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        className={cn(
                            "flex-1 min-w-[120px] transition-all duration-300",
                            isParticipating
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                                : "bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white"
                        )}
                        onClick={() => user && toggleParticipation(event.id, user)}
                    >
                        {isParticipating ? <Check className="h-4 w-4 mr-1" /> : null}
                        {isParticipating ? 'Inscrit' : 'Participer'}
                    </Button>
                </CardFooter>
            </Card>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title={event.title}
                url={`${window.location.origin}/events/${event.id}`}
            />
        </>
    );
};

const CalendarIcon = ({ date }: { date: Date }) => (
    <div className="text-center bg-white/20 p-2 rounded-lg backdrop-blur-sm text-white">
        <div className="text-xs uppercase font-semibold">{date.toLocaleString('default', { month: 'short' })}</div>
        <div className="text-2xl font-bold leading-none">{date.getDate()}</div>
    </div>
);
