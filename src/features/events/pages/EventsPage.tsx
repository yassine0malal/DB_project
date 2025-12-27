import { useState, useEffect } from 'react';
import { useClubStore } from '../../clubs/store/useClubStore';
import { EventCard } from '../../clubs/components/EventCard';
import { EventFilters } from '../components/EventFilters';
import { Button } from '../../../components/ui/button';
import { Calendar, Filter } from 'lucide-react';
import { mockClubs } from '../../clubs/data/mockData';
import { localDB } from '../../../lib/localDB';

export const EventsPage = () => {
    const { clubs, setClubs } = useClubStore();

    useEffect(() => {
        const stored = localDB.get();
        // Check if there are clubs AND if at least one club has events (handling stale data)
        const hasData = stored.clubs.length > 0;
        const hasEvents = stored.clubs.some(c => c.events && c.events.length > 0);

        if (hasData && hasEvents) {
            setClubs(stored.clubs);
        } else {
            // Seed if empty or stale (no events)
            console.log('Seeding mock data for events...');
            setClubs(mockClubs);
            localDB.save({ clubs: mockClubs });
        }
    }, []);

    // Aggregate events
    const allEvents = clubs.flatMap(club =>
        club.events.map(event => ({ ...event, clubName: club.name }))
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const [filters, setFilters] = useState({
        search: '',
        date: 'all',
        onCampus: false,
        online: false,
        type: 'all' // all, free, paid
    });

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Filter Logic
    const filteredEvents = allEvents.filter(event => {
        // Search
        if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

        // Date
        const eventDate = new Date(event.date);
        const today = new Date();
        if (filters.date === 'today' && eventDate.getDate() !== today.getDate()) return false;
        if (filters.date === 'week') {
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            if (eventDate > nextWeek || eventDate < today) return false;
        }

        // Location
        if (filters.onCampus && event.isOnline) return false;
        if (filters.online && !event.isOnline) return false;
        // Simplified Logic: if both unchecked, show all. If one checked, show only that type.
        if (filters.onCampus && !filters.online && event.isOnline) return false;
        if (filters.online && !filters.onCampus && !event.isOnline) return false;

        // Type
        if (filters.type === 'free' && event.isPaid) return false;
        if (filters.type === 'paid' && !event.isPaid) return false;

        return true;
    });

    // Events of the Day Widget Data
    const todayEvents = allEvents.filter(e => {
        const d = new Date(e.date);
        const t = new Date();
        return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
                    <p className="text-gray-500 mt-1">Ne manquez rien de la vie étudiante !</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <EventFilters activeFilters={filters} onFilterChange={handleFilterChange} />

                    {/* Events of the Day Widget */}
                    {todayEvents.length > 0 && (
                        <div className="bg-blue-600 rounded-xl p-6 text-white text-center shadow-lg shadow-blue-200">
                            <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg">Aujourd'hui</h3>
                            <p className="text-blue-100 text-sm mb-4">{todayEvents.length} événements prévus</p>
                            <Button variant="outline" className="w-full text-blue-700 font-bold bg-white hover:bg-blue-50">
                                Voir le programme
                            </Button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Featured / Hero (Optional, skipped for now to focus on list) */}

                    {/* List */}
                    {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                // @ts-ignore
                                <EventCard key={event.id} event={event} clubName={event.clubName} vertical />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                                <Filter className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Aucun événement trouvé</h3>
                            <p className="text-gray-500">Essayez d'autres filtres.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
