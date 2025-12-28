
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Search, Calendar, MapPin } from 'lucide-react';

interface EventFiltersProps {
    className?: string;
    activeFilters: any;
    onFilterChange: (key: string, value: any) => void;
}

export const EventFilters = ({ className, activeFilters, onFilterChange }: EventFiltersProps) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche</label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            placeholder="Rechercher un événement..."
                            value={activeFilters.search || ''}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Calendar className="h-4 w-4" /> Date
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['all', 'today', 'week', 'month'].map((date) => (
                            <Button
                                key={date}
                                variant={activeFilters.date === date ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onFilterChange('date', date)}
                                className="capitalize"
                            >
                                {date === 'all' ? 'Tout' : date === 'today' ? "Auj." : date === 'week' ? 'Cette sem.' : 'Ce mois'}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="h-4 w-4" /> Localisation
                    </label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-400">
                            <input
                                type="checkbox"
                                checked={activeFilters.onCampus}
                                onChange={(e) => onFilterChange('onCampus', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            Sur le campus
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-400">
                            <input
                                type="checkbox"
                                checked={activeFilters.online}
                                onChange={(e) => onFilterChange('online', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            En ligne (Visio)
                        </label>
                    </div>
                </div>


            </CardContent>
        </Card>
    );
};
