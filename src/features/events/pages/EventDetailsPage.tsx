import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useClubStore } from '../../clubs/store/useClubStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { Calendar, MapPin, Video, Euro, Share2, Users, ArrowLeft, Linkedin, Building2, Check } from 'lucide-react';
import { ShareModal } from '../../feed/components/ShareModal';
import { cn } from '../../../utils/cn';

export const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { toggleParticipation } = useClubStore();
    const { user } = useAuthStore();
    const [showShareModal, setShowShareModal] = useState(false);

    // Create local state for single event fetching
    const [event, setEvent] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);


    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const viewerIdParam = user ? `?viewerId=${user.id}` : '';
                const response = await fetch(`http://localhost:3000/api/events/${id}${viewerIdParam}`);
                if (!response.ok) throw new Error('Failed to fetch event');
                const data = await response.json();
                setEvent(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id, user]);

    if (isLoading) return <div className="p-20 text-center">Chargement de l'événement...</div>;
    if (error || !event) return <div className="p-20 text-center text-red-500">Erreur: {error || 'Événement introuvable'}</div>;

    const isParticipating = event.isAttending; // Use backend flag
    const isUpcoming = event.date ? new Date(event.date.replace(' ', 'T')) > new Date() : false;



    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-6">
            <Link to="/events">
                <Button variant="ghost" size="sm" className="mb-2 gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux événements
                </Button>
            </Link>

            {/* Hero Section */}
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
                {event.coverUrl && !imgError ? (
                    <img
                        src={event.coverUrl}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-80"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-800" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="flex gap-3 mb-4">
                        <Badge className="bg-blue-600 hover:bg-blue-700 border-none text-white px-3 py-1">
                            {event.club?.category || 'Événement'}
                        </Badge>
                        {isUpcoming ? (
                            <Badge className="bg-green-500 hover:bg-green-600 border-none text-white px-3 py-1">À venir</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-gray-500/50 text-white border-none backdrop-blur-sm">Terminé</Badge>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{event.title}</h1>
                    <div className="flex flex-col md:flex-row gap-6 text-gray-200 font-medium text-lg">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-400" />
                            {new Date(event.date.replace(' ', 'T')).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            {event.isOnline ? <Video className="h-5 w-5 text-blue-400" /> : <MapPin className="h-5 w-5 text-blue-400" />}
                            {event.location}
                        </div>
                        {event.isPaid && (
                            <div className="flex items-center gap-2">
                                <Euro className="h-5 w-5 text-yellow-400" />
                                {event.price}€ / personne
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">À propos de l'événement</h2>
                        <div className="prose max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                            {event.fullDescription ? event.fullDescription : event.description}
                        </div>
                    </section>

                    {/* Guests */}
                    {event.guests && event.guests.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Invités & Intervenants</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.guests.map((guest: any) => (
                                    <div key={guest.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                                            {guest.avatarUrl && <img src={guest.avatarUrl} alt={guest.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{guest.name}</h4>
                                            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{guest.role}</p>
                                            {guest.company && (
                                                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                    <Building2 className="h-3 w-3" />
                                                    {guest.company}
                                                </div>
                                            )}
                                        </div>
                                        {guest.linkedInUrl && (
                                            <a href={guest.linkedInUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-gray-400 hover:text-blue-700">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gallery (Mock) */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Galerie</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={`https://source.unsplash.com/random/800x600?event,tech,sig=${i}${event.title}`} alt="Event" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Organizer Card */}
                    <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                        <div className="bg-gray-100 dark:bg-gray-900 h-20 relative">
                            {event.club.coverUrl && <img src={event.club.coverUrl} className="w-full h-full object-cover opacity-50" />}
                            <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-lg border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                                {event.club.logoUrl && <img src={event.club.logoUrl} className="w-full h-full object-cover" />}
                            </div>
                        </div>
                        <CardContent className="pt-8 pb-6 px-6">
                            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-gray-100">{event.club.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{event.club.description}</p>
                            <Link to={`/clubs/${event.club.id}`}>
                                <Button variant="outline" size="sm" className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                                    Voir le club
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="p-6 sticky top-24 dark:bg-gray-800 dark:border-gray-700">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Inscription</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {event.isPaid ? "Cet événement est payant." : "Cet événement est gratuit et ouvert à tous."}
                                </p>
                                <Button
                                    className={cn(
                                        "w-full shadow-md h-12 text-lg font-bold transition-all duration-300",
                                        isParticipating
                                            ? "bg-green-500 hover:bg-green-600 text-white shadow-green-100"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                    )}
                                    onClick={() => user && toggleParticipation(event.id, user)}
                                >
                                    {isParticipating && <Check className="h-5 w-5 mr-2" />}
                                    {isParticipating ? 'Je suis inscrit' : 'Je participe'}
                                </Button>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-700" />

                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {event.attendees.length} participants
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                                    onClick={() => setShowShareModal(true)}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div >

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title={event.title}
                url={`${window.location.origin}/events/${event.id}`}
            />
        </div >
    );
};
