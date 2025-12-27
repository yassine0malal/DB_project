import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Image as ImageIcon, Smile, BarChart2 } from 'lucide-react';
import { Post } from '../types';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { localDB } from '../../../lib/localDB';
import { CreatePostModal } from '../components/CreatePostModal';

export const FeedPage = () => {
    const { filter, setFilter, getFilteredPosts } = usePostStore();
    const { user } = useAuthStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const displayPosts = getFilteredPosts((user as any)?.department);

    // Seed data if empty
    useEffect(() => {
        const initialPosts: Post[] = [
            {
                id: '1',
                type: 'image',
                content: "Marhaban bikoum sur EnsetReseux ! 🎓 La plateforme officielle pour les étudiants de l'ENSET Mohammedia. Partagez vos projets, rejoignez des clubs et restez au courant de tout ce qui se passe sur le campus. \n\nN'oubliez pas de compléter votre profil !",
                createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
                author: {
                    id: '3',
                    email: 'admin.dsi@enset-media.ac.ma',
                    firstName: 'Youssef',
                    lastName: 'Mansouri',
                    role: 'admin',
                    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
                    department: 'Direction du Système d\'Information',
                    adminRole: 'Responsable DSI',
                    emergencyContact: '+212 5 23 32 22 22',
                    availabilityHours: '08:30 - 16:30',
                    responsibilities: ['Admin System', 'Security'],
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                likesCount: 254,
                commentsCount: 2,
                sharesCount: 45,
                isLiked: true,
                imageUrl: 'https://images.unsplash.com/photo-1523050335456-c6bb7f9cc99b?auto=format&fit=crop&q=80&w=1200&h=600',
                comments: []
            },
            {
                id: '2',
                type: 'image',
                content: "Fier de présenter mon projet d'architecture Cloud pour le secteur bancaire marocain ! 🚀 Travailler sur des problématiques locales est vraiment passionnant. Des retours sur l'architecture ?",
                createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
                author: {
                    id: '1',
                    email: 'amine.alami@enset-media.ac.ma',
                    firstName: 'Amine',
                    lastName: 'El Alami',
                    role: 'student',
                    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
                    studentId: '20230156',
                    major: 'Génie Informatique',
                    level: 'M1',
                    academicYear: '2024-2025',
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                likesCount: 128,
                commentsCount: 10,
                sharesCount: 12,
                imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200&h=600',
                comments: []
            },
            {
                id: '4',
                type: 'text',
                content: "Bonjour chers étudiants ! Je viens de publier les ressources pour le module Algorithmique Avancée sur le Cloud. C'est un sujet d'actualité pour nos futures entreprises technologiques au Maroc. 📚",
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
                author: {
                    id: '2',
                    email: 'fatima.bennani@enset-media.ac.ma',
                    firstName: 'Fatima Zahra',
                    lastName: 'Bennani',
                    role: 'teacher',
                    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
                    title: 'Dr.',
                    department: 'Génie Informatique',
                    status: 'permanent',
                    officeLocation: 'Département Informatique, Bureau 12',
                    officeHours: 'Lundi 10h-12h, Mercredi 15h-17h',
                    subjects: ['Base de données', 'Algorithmique Avancée', 'Architectures Cloud'],
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                likesCount: 89,
                commentsCount: 12,
                sharesCount: 20,
                comments: []
            },
            {
                id: '5',
                type: 'poll',
                content: "Quelle est votre stack préférée pour le développement d'applications au Maroc en 2024 ? 🤔",
                createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
                author: {
                    id: '1',
                    email: 'amine.alami@enset-media.ac.ma',
                    firstName: 'Amine',
                    lastName: 'El Alami',
                    role: 'student',
                    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
                    studentId: '20230156',
                    major: 'Génie Informatique',
                    level: 'M1',
                    academicYear: '2024-2025',
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                poll: {
                    question: "Stack de prédilection ?",
                    options: [
                        { id: '1', label: 'MERN (React/Node)', votes: 156 },
                        { id: '2', label: 'Laravel / Vue', votes: 89 },
                        { id: '3', label: 'Django / React', votes: 45 },
                        { id: '4', label: 'Spring Boot / Angular', votes: 112 }
                    ],
                    totalVotes: 402
                },
                likesCount: 65,
                commentsCount: 28,
                sharesCount: 8,
                comments: []
            },
            {
                id: '6',
                type: 'image',
                content: "Aperçu de notre robot agricole intelligent pour aider les agriculteurs de la région de Mohammedia ! 🤖🚜 Projet de fin d'année du club Robotique.",
                createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
                author: {
                    id: '6',
                    email: 'yassine.idrissi@enset-media.ac.ma',
                    firstName: 'Yassine',
                    lastName: 'Idrissi',
                    role: 'student',
                    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
                    studentId: '20230002',
                    major: 'Génie Mécanique',
                    level: 'L3',
                    academicYear: '2024-2025',
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200&h=600',
                likesCount: 312,
                commentsCount: 45,
                sharesCount: 67,
                comments: []
            },
            {
                id: '7',
                type: 'text',
                content: "Trop contente ! J'ai été acceptée pour un stage PFE chez Capgemini Casablanca ! Merci à tous pour les conseils sur la préparation des entretiens. ✨",
                createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
                author: {
                    id: '4',
                    email: 'salma.tazi@enset-media.ac.ma',
                    firstName: 'Salma',
                    lastName: 'Tazi',
                    role: 'student',
                    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
                    studentId: '20230099',
                    major: 'Génie Logiciel',
                    level: 'M2',
                    academicYear: '2024-2025',
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                likesCount: 524,
                commentsCount: 89,
                sharesCount: 34,
                comments: []
            },
            {
                id: '8',
                type: 'image',
                content: "Souvenir de la cérémonie de remise des diplômes de l'année dernière de l'ENSET Mohammedia. 👩‍🎓👨‍🎓 Félicitations encore à tous nos diplômés !",
                createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
                author: {
                    id: '3',
                    email: 'admin.dsi@enset-media.ac.ma',
                    firstName: 'Youssef',
                    lastName: 'Mansouri',
                    role: 'admin',
                    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
                    department: 'Direction du Système d\'Information',
                    adminRole: 'Responsable DSI',
                    emergencyContact: '+212 5 23 32 22 22',
                    availabilityHours: '08:30 - 16:30',
                    responsibilities: ['Admin System', 'Security'],
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                imageUrl: 'https://images.unsplash.com/photo-1523050335456-c6bb7f9cc99b?auto=format&fit=crop&q=80&w=1200&h=600',
                likesCount: 856,
                commentsCount: 34,
                sharesCount: 89,
                comments: []
            },
            {
                id: '9',
                type: 'text',
                content: "N'oubliez pas l'atelier sur le Deep Learning ce samedi à 10h au département Informatique. Places limitées ! Inscrivez-vous via le Club Coding. 🔥",
                createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
                author: {
                    id: '2',
                    email: 'fatima.bennani@enset-media.ac.ma',
                    firstName: 'Fatima Zahra',
                    lastName: 'Bennani',
                    role: 'teacher',
                    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
                    title: 'Dr.',
                    department: 'Génie Informatique',
                    status: 'permanent',
                    officeLocation: 'Département Informatique, Bureau 12',
                    officeHours: 'Lundi 10h-12h, Mercredi 15h-17h',
                    subjects: ['Base de données', 'Algorithmique Avancée', 'Architectures Cloud'],
                    createdAt: new Date().toISOString(),
                    followers: [],
                    following: []
                } as any,
                likesCount: 42,
                commentsCount: 5,
                sharesCount: 10,
                comments: []
            }
        ];
        localDB.seed(initialPosts);
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            {/* Create Post Trigger Card */}
            <Card className="shadow-sm border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all" onClick={() => setIsCreateModalOpen(true)}>
                <CardContent className="p-4 flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0 overflow-hidden">
                        {user?.avatarUrl ? <img src={user.avatarUrl} className="h-full w-full object-cover" /> : user?.firstName[0]}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-500 font-medium hover:bg-gray-200 transition-colors text-left">
                        Quoi de neuf, {user?.firstName} ? Commencez une publication...
                    </div>
                </CardContent>
                <div className="px-4 py-3 border-t bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4 ml-2">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            Photo
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                            <BarChart2 className="h-4 w-4 text-green-500" />
                            Sondage
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">
                            <Smile className="h-4 w-4 text-yellow-500" />
                            Humeur
                        </div>
                    </div>
                </div>
            </Card>

            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="rounded-full px-4 font-semibold shadow-sm"
                >
                    Tous
                </Button>
                <Button
                    variant={filter === 'popular' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('popular')}
                    className="rounded-full px-4 font-semibold shadow-sm"
                >
                    Populaires 🔥
                </Button>
                {(user as any)?.department && (
                    <Button
                        variant={filter === 'department' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('department')}
                        className="rounded-full px-4 font-semibold shadow-sm"
                    >
                        Mon Département ({(user as any).department})
                    </Button>
                )}
            </div>

            {/* Feed List */}
            <div className="space-y-6">
                {displayPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
                {displayPosts.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Aucune publication trouvée pour ce filtre.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
