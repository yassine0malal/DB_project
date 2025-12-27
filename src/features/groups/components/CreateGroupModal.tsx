import { useState } from 'react';
import { X, Users, Home, GraduationCap, Trophy, Heart, Globe, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useGroupStore } from '../store/useGroupStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { GroupType, GroupVisibility } from '../types';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const groupTypes: { value: GroupType; label: string; icon: React.ElementType; description: string }[] = [
    { value: 'friends', label: 'Groupe d\'amis', icon: Heart, description: 'Pour vos amis proches' },
    { value: 'apartment', label: 'Colocation', icon: Home, description: 'Gérer votre appartement' },
    { value: 'class', label: 'Promotion', icon: GraduationCap, description: 'Votre classe/année' },
    { value: 'club', label: 'Sous-groupe club', icon: Trophy, description: 'Extension d\'un club' }
];

export const CreateGroupModal = ({ isOpen, onClose }: CreateGroupModalProps) => {
    const { user } = useAuthStore();
    const { createGroup, groups } = useGroupStore();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<GroupType>('friends');
    const [visibility, setVisibility] = useState<GroupVisibility>('public');
    const [coverUrl, setCoverUrl] = useState('');

    // For class groups
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [major, setMajor] = useState('');
    const [level, setLevel] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name.trim()) return;

        const newGroup = {
            id: `g${Date.now()}`,
            name: name.trim(),
            description: description.trim(),
            type,
            visibility,
            coverUrl: coverUrl || undefined,
            createdAt: new Date().toISOString(),
            createdBy: user,
            members: [{ user, role: 'admin' as const, joinedAt: new Date().toISOString() }],
            posts: [],
            rules: [],
            ...(type === 'class' && { academicYear, major, level })
        };

        createGroup(newGroup);
        handleClose();
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setType('friends');
        setVisibility('public');
        setCoverUrl('');
        setAcademicYear('2024-2025');
        setMajor('');
        setLevel('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-900">Créer un groupe</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Group Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du groupe *
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Squad Informatique 🔥"
                            className="w-full"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez votre groupe..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Group Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de groupe
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {groupTypes.map(({ value, label, icon: Icon, description }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setType(value)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${type === value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 mb-1 ${type === value ? 'text-blue-600' : 'text-gray-500'}`} />
                                    <p className={`font-medium text-sm ${type === value ? 'text-blue-900' : 'text-gray-900'}`}>
                                        {label}
                                    </p>
                                    <p className="text-xs text-gray-500">{description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Class-specific fields */}
                    {type === 'class' && (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm font-medium text-blue-800">Informations académiques</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Niveau</label>
                                    <Input
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        placeholder="Ex: M1, L3..."
                                        className="bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Année académique</label>
                                    <Input
                                        value={academicYear}
                                        onChange={(e) => setAcademicYear(e.target.value)}
                                        placeholder="2024-2025"
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Filière</label>
                                <Input
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    placeholder="Ex: Génie Informatique"
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    )}

                    {/* Visibility */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visibilité
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setVisibility('public')}
                                className={`flex-1 p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${visibility === 'public'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Globe className={`h-5 w-5 ${visibility === 'public' ? 'text-green-600' : 'text-gray-500'}`} />
                                <div className="text-left">
                                    <p className={`font-medium text-sm ${visibility === 'public' ? 'text-green-900' : 'text-gray-900'}`}>
                                        Public
                                    </p>
                                    <p className="text-xs text-gray-500">Tout le monde peut voir</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibility('private')}
                                className={`flex-1 p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${visibility === 'private'
                                        ? 'border-gray-700 bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Lock className={`h-5 w-5 ${visibility === 'private' ? 'text-gray-700' : 'text-gray-500'}`} />
                                <div className="text-left">
                                    <p className={`font-medium text-sm ${visibility === 'private' ? 'text-gray-900' : 'text-gray-900'}`}>
                                        Privé
                                    </p>
                                    <p className="text-xs text-gray-500">Sur invitation</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Cover URL (optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image de couverture (URL)
                        </label>
                        <Input
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                            Annuler
                        </Button>
                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Créer le groupe
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
