import { useEffect } from 'react';
import { useEventStore } from '../store/useEventStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { EventCard } from '../../clubs/components/EventCard';
import { EventFilters } from '../components/EventFilters';
import { Button } from '../../../components/ui/button';
import { Calendar, Filter } from 'lucide-react';

export const EventsPage = () => {
    const { fetchEvents, getFilteredEvents, filters, setFilter, isLoading } = useEventStore();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchEvents(user?.id);
    }, [user?.id]);

    const filteredEvents = getFilteredEvents();

    // Events of the Day Widget Data
    const todayEvents = filteredEvents.filter(e => {
        const d = new Date(e.date);
        const t = new Date();
        return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Événements</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Ne manquez rien de la vie étudiante !</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <EventFilters
                        activeFilters={filters}
                        onFilterChange={(key, value) => setFilter(key as any, value)}
                    />

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
                    {/* List */}
                    {isLoading ? (
                        <div className="min-h-[200px] flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                // @ts-ignore
                                <EventCard key={event.id} event={event} clubName={event.clubName} vertical />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-full inline-block shadow-sm mb-4">
                                <Filter className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Aucun événement trouvé</h3>
                            <p className="text-gray-500 dark:text-gray-400">Essayez d'autres filtres.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
