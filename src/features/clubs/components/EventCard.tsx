import { MapPin, Clock, Video, Euro, Share2, Check } from 'lucide-react';
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
                "overflow-hidden hover:shadow-lg transition-all duration-300 group border-gray-200",
                vertical ? "w-full" : "min-w-[320px] max-w-[320px]"
            )}>
                {/* Cover Image & Badges */}
                <div className="relative h-40 bg-gray-100 overflow-hidden">
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
                        <Badge variant={event.isOnline ? "secondary" : "default"} className="bg-white/90 text-black shadow-sm backdrop-blur-md hover:bg-white">
                            {event.isOnline ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                            {event.isOnline ? 'En ligne' : 'Présentiel'}
                        </Badge>
                        {event.isPaid && (
                            <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 border-none shadow-sm">
                                <Euro className="w-3 h-3 mr-1" />
                                {event.price ? `${event.price}€` : 'Payant'}
                            </Badge>
                        )}
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
                            <h4 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {event.title}
                            </h4>
                        </div>
                        {clubName && (
                            <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                {clubName}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {event.isOnline ? <Video className="h-4 w-4 text-gray-400" /> : <MapPin className="h-4 w-4 text-gray-400" />}
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {event.attendees.slice(0, 3).map((attendee, i) => (
                                    <div key={attendee.id || i} className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-blue-600 overflow-hidden shadow-sm">
                                        {attendee.avatarUrl ? <img src={attendee.avatarUrl} className="h-full w-full object-cover" /> : attendee.firstName?.[0]}
                                    </div>
                                ))}
                                {event.attendees.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
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
                            className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowShareModal(true);
                            }}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 gap-2">
                    <Link to={`/events/${event.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            Détails
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        className={cn(
                            "flex-1 transition-all duration-300",
                            isParticipating
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
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
