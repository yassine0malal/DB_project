import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useClubStore } from '../store/useClubStore';
import { ClubCard } from '../components/ClubCard';
import { CreateClubModal } from '../components/CreateClubModal';
import { EventCard } from '../components/EventCard';
import { Calendar } from 'lucide-react';
import { localDB } from '../../../lib/localDB';
import { mockClubs } from '../data/mockData';

export const ClubListPage = () => {
    const { clubs, filters, setFilter, getFilteredClubs, setClubs } = useClubStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const filteredClubs = getFilteredClubs();

    useEffect(() => {
        // Load clubs from localDB on mount
        const stored = localDB.get();
        if (stored.clubs.length > 0) {
            setClubs(stored.clubs);
        } else {
            // Seed mock clubs with events
            setClubs(mockClubs);
            localDB.save({ clubs: mockClubs });
        }
    }, []);

    const categories = ['all', 'Tech', 'Sport', 'Art', 'Academic'];

    // Dynamic upcoming events from store
    const upcomingEvents = clubs
        .flatMap(club => club.events.map(event => ({ ...event, clubName: club.name })))
        .filter(event => new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vie Associative</h1>
                    <p className="text-gray-500 mt-1">Découvrez et rejoignez les clubs de l'université.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">Créer un club</Button>
            </div>


            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher un club..."
                        className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-all"
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={filters.category === cat ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('category', cat)}
                            className={filters.category === cat ? 'bg-gray-900 text-white hover:bg-gray-800' : 'text-gray-600'}
                        >
                            {cat === 'all' ? 'Tous' : cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredClubs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredClubs.map(club => (
                        <ClubCard key={club.id} club={club} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                        <Filter className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Aucun club trouvé</h3>
                    <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
                </div>
            )}
            {/* Upcoming Events Section */}
            <div className="space-y-4 pt-8 border-t">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg"><Calendar className="h-5 w-5" /></span>
                        Événements à venir
                    </h2>
                    <Button variant="link" className="text-blue-600">Voir tout</Button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="min-w-[300px] md:min-w-[350px]">
                            {/* @ts-ignore - event type mismatch workaround for quick prototyping */}
                            <EventCard event={event} clubName={event.clubName} />
                        </div>
                    ))}
                </div>
            </div>

            <CreateClubModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
};
