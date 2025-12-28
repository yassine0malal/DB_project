import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users, Home, GraduationCap, Trophy, Heart } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useGroupStore } from '../store/useGroupStore';
import { GroupCard } from '../components/GroupCard';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { GroupType } from '../types';

const groupTypeFilters: { value: GroupType | 'all'; label: string; icon: React.ElementType }[] = [
    { value: 'all', label: 'Tous', icon: Users },
    { value: 'friends', label: 'Amis', icon: Heart },
    { value: 'apartment', label: 'Colocation', icon: Home },
    { value: 'class', label: 'Promotion', icon: GraduationCap },
    { value: 'club', label: 'Clubs', icon: Trophy }
];

export const GroupListPage = () => {
    const { groups, filters, setFilter, getFilteredGroups, fetchGroups, isLoading } = useGroupStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const filteredGroups = getFilteredGroups();

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    if (isLoading) {
        return <div className="flex justify-center py-20">Chargement...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mes Groupes</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Créez et rejoignez des groupes pour collaborer et échanger.</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Créer un groupe
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center transition-colors">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                        placeholder="Rechercher un groupe..."
                        className="pl-9 bg-gray-50 dark:bg-gray-900 border-transparent focus:bg-white dark:focus:bg-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all border-none"
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                    />
                </div>

                {/* Type Filters */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {groupTypeFilters.map(({ value, label, icon: Icon }) => (
                        <Button
                            key={value}
                            variant={filters.type === value ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('type', value)}
                            className={`flex items-center gap-1.5 whitespace-nowrap ${filters.type === value
                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {groupTypeFilters.slice(1).map(({ value, label, icon: Icon }) => {
                    const count = groups.filter(g => g.type === value).length;
                    return (
                        <div
                            key={value}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 transition-colors"
                        >
                            <div className={`p-2 rounded-lg ${value === 'friends' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
                                value === 'apartment' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                    value === 'class' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                }`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Groups Grid */}
            {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGroups.map(group => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-full inline-block shadow-sm mb-4">
                        <Filter className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Aucun groupe trouvé</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Essayez de modifier vos filtres ou créez un nouveau groupe.</p>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                        Créer mon premier groupe
                    </Button>
                </div>
            )}

            {/* Create Modal */}
            <CreateGroupModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
};
