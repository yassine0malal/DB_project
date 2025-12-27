import { Club } from '../types';
import { MOCK_STUDENT, MOCK_TEACHER, MOCK_ADMIN, MOCK_USERS } from '../../auth/data/mockUsers';

export const mockClubs: Club[] = [
    {
        id: '1',
        name: 'Club Coding ENSET',
        description: 'Le club des passionnés de programmation de l\'ENSET Mohammedia. Hackathons, ateliers et projets innovants au programme ! Nous formons la prochaine génération de leaders technologiques au Maroc.',
        category: 'Tech',
        createdAt: new Date(2023, 9, 15).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200&h=400',
        contactEmail: 'coding.club@enset-media.ac.ma',
        website: 'https://coding-enset.ma',
        rules: [
            'Démontrer une passion pour le code.',
            'Participer activement aux ateliers hebdomadaires.',
            'Respecter les principes de l\'open source et de l\'entraide.',
            'Pas de harcèlement ni de discrimination.'
        ],
        members: [
            { user: MOCK_STUDENT, role: 'admin', joinedAt: new Date(2023, 9, 15).toISOString() },
            { user: MOCK_TEACHER, role: 'moderator', joinedAt: new Date(2023, 9, 20).toISOString() },
            { user: MOCK_USERS[3], role: 'member', joinedAt: new Date(2023, 10, 5).toISOString() },
            { user: MOCK_USERS[4], role: 'member', joinedAt: new Date(2023, 11, 2).toISOString() }
        ],
        posts: [
            {
                id: 'cp1',
                type: 'image',
                content: "Souvenir de notre dernier hackathon interne ! Félicitations à l'équipe 'Debuggers' pour leur projet de gestion de bibliothèque intelligente. 🚀",
                imageUrl: 'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000',
                author: MOCK_STUDENT,
                createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
                likesCount: 156,
                commentsCount: 12,
                sharesCount: 8,
                comments: []
            },
            {
                id: 'cp2',
                type: 'text',
                content: "🚨 Annonce : L'atelier de ce soir sur React Three Fiber est reporté à demain 18h en salle B12. Nous allons explorer le monde de la 3D dans le navigateur ! 🌐",
                author: MOCK_STUDENT,
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
                likesCount: 42,
                commentsCount: 3,
                sharesCount: 1,
                comments: []
            }
        ],
        events: [
            {
                id: 'e1',
                clubId: '1',
                title: 'Coding Night Mohammedia',
                description: 'Une nuit entière pour coder et relever des défis technologiques passionnants.',
                fullDescription: `
# Coding Night Mohammedia

Rejoignez le plus grand événement de code de la ville !

## Le Défi
Développement d'une solution innovante pour la gestion de l'eau au Maroc.

## Programme
- **Vendredi 20h** : Lancement des défis
- **Nuit blanche** : Code, Pizza et Mentoring
- **Samedi 08h** : Présentations et Petit-déjeuner beldi

## À gagner
Stages de fin d'études chez des startups technologiques et bons d'achat.
                `,
                date: new Date(Date.now() + 86400000 * 2).toISOString(),
                location: 'Grand Amphithéâtre ENSET',
                attendees: [MOCK_STUDENT, MOCK_USERS[3]],
                isOnline: false,
                isPaid: false,
                guests: [
                    {
                        id: 'g1',
                        name: 'Omar Jamali',
                        role: 'CTO',
                        company: 'TechMorocco',
                        avatarUrl: 'https://i.pravatar.cc/150?u=omar'
                    },
                    {
                        id: 'g2',
                        name: 'Nadia El Fassi',
                        role: 'Expert Cloud',
                        company: 'AWS Morocco'
                    }
                ],
                status: 'upcoming',
                tags: ['Coding', 'Innovation', 'ENSET'],
                coverUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000'
            }
        ]
    },
    {
        id: '2',
        name: 'BDS ENSET (Bureau des Sports)',
        description: 'Organisation des compétitions sportives universitaires. Pour l\'honneur de l\'ENSET ! Le sport c\'est la santé et l\'esprit d\'équipe.',
        category: 'Sport',
        createdAt: new Date(2023, 8, 1).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200&h=400',
        contactEmail: 'bds.enset@enset-media.ac.ma',
        rules: [
            'Fair-play avant tout.',
            'Assiduité aux entraînements.',
            'Représenter fièrement les couleurs de l\'ENSET.',
            'Prendre soin du matériel sportif.'
        ],
        members: [
            { user: MOCK_USERS[5], role: 'admin', joinedAt: new Date(2023, 8, 1).toISOString() },
            { user: MOCK_USERS[4], role: 'moderator', joinedAt: new Date(2023, 8, 10).toISOString() },
            { user: MOCK_STUDENT, role: 'member', joinedAt: new Date(2023, 9, 2).toISOString() }
        ],
        posts: [
            {
                id: 'sp1',
                type: 'image',
                content: "Victoire éclatante de notre équipe de basket contre l'EST hier ! 68 - 54. Bravo les gars ! 🏀🏆",
                imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1000',
                author: MOCK_USERS[5],
                createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
                likesCount: 289,
                commentsCount: 24,
                sharesCount: 15,
                comments: []
            },
            {
                id: 'sp2',
                type: 'poll',
                content: "Quel sport souhaiteriez-vous voir ajouté au prochain tournoi inter-filières ? ⚽🎾🏐",
                author: MOCK_USERS[5],
                poll: {
                    question: "Sport préféré ?",
                    options: [
                        { id: '1', label: 'E-Sports', votes: 124 },
                        { id: '2', label: 'Badminton', votes: 45 },
                        { id: '3', label: 'Handball', votes: 89 },
                        { id: '4', label: 'Tennis de table', votes: 67 }
                    ],
                    totalVotes: 325
                },
                createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
                likesCount: 56,
                commentsCount: 18,
                sharesCount: 3,
                comments: []
            }
        ],
        events: [
            {
                id: 'e2',
                clubId: '2',
                title: 'Champions League ENSET',
                description: 'Le tournoi de football inter-filières le plus attendu de l\'année.',
                date: new Date(Date.now() + 86400000 * 5).toISOString(),
                location: 'Stade Municipal de Mohammedia',
                attendees: [MOCK_USERS[5], MOCK_USERS[4], MOCK_STUDENT],
                isOnline: false,
                isPaid: true,
                price: 20,
                currency: 'MAD',
                status: 'upcoming',
                tags: ['Sport', 'Football', 'ENSET'],
                coverUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=1000'
            }
        ]
    },
    {
        id: '3',
        name: 'Club Théâtre & Culture',
        description: 'Expression artistique, chant patriotique et pièces de théâtre classiques et modernes. Un espace pour libérer votre créativité !',
        category: 'Art',
        createdAt: new Date(2023, 10, 1).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200&h=400',
        contactEmail: 'culture.club@enset-media.ac.ma',
        rules: [
            'Respecter le silence lors des répétitions.',
            'Avoir l\'esprit ouvert.',
            'Être ponctuel aux séances de théâtre.',
            'Prendre soin des costumes et décors.'
        ],
        members: [
            { user: MOCK_TEACHER, role: 'admin', joinedAt: new Date(2023, 10, 1).toISOString() },
            { user: MOCK_USERS[3], role: 'moderator', joinedAt: new Date(2023, 10, 15).toISOString() },
            { user: MOCK_USERS[4], role: 'member', joinedAt: new Date(2023, 11, 1).toISOString() }
        ],
        posts: [
            {
                id: 'ap1',
                type: 'image',
                content: "Répétition générale pour la pièce 'Le Malade Imaginaire'. Les acteurs sont au top ! Rendez-vous jeudi soir. 🎭✨",
                imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1000',
                author: MOCK_TEACHER,
                createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
                likesCount: 112,
                commentsCount: 9,
                sharesCount: 14,
                comments: []
            }
        ],
        events: [
            {
                id: 'e3',
                clubId: '3',
                title: 'Soirée Culturelle Marocaine',
                description: 'Une soirée dédiée au patrimoine marocain à travers le théâtre et la poésie.',
                date: new Date(Date.now() + 86400000 * 10).toISOString(),
                location: 'Salle de Conférence',
                attendees: [MOCK_TEACHER, MOCK_USERS[3]],
                isOnline: false,
                isPaid: true,
                price: 50,
                currency: 'MAD',
                status: 'upcoming',
                tags: ['Culture', 'Maroc', 'Art'],
                coverUrl: 'https://images.unsplash.com/photo-1514525253361-b83f85f553c0?auto=format&fit=crop&q=80&w=1000'
            }
        ]
    },
    {
        id: '4',
        name: 'Junior Entreprise ENSET',
        description: 'Faire le lien entre la formation académique et le monde de l\'entreprise au Maroc. Préparer les étudiants à la vie professionnelle par des projets réels.',
        category: 'Academic',
        createdAt: new Date(2023, 0, 15).toISOString(),
        coverUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200&h=400',
        contactEmail: 'junior.entreprise@enset-media.ac.ma',
        website: 'https://je-enset.ma',
        rules: [
            'Professionnalisme constant.',
            'Confidentialité des projets clients.',
            'Proactivité et esprit entrepreneurial.',
            'Respect des délais (Deadlines).'
        ],
        members: [
            { user: MOCK_ADMIN, role: 'admin', joinedAt: new Date(2023, 1, 1).toISOString() },
            { user: MOCK_STUDENT, role: 'moderator', joinedAt: new Date(2023, 2, 10).toISOString() },
            { user: MOCK_USERS[3], role: 'member', joinedAt: new Date(2023, 3, 5).toISOString() }
        ],
        posts: [
            {
                id: 'ep1',
                type: 'text',
                content: "Nous sommes ravis d'annoncer notre nouveau partenariat avec MAScIR pour le développement de projets R&D ! Une grande opportunité pour nos étudiants. 🤝💼",
                author: MOCK_ADMIN,
                createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
                likesCount: 432,
                commentsCount: 31,
                sharesCount: 56,
                comments: []
            }
        ],
        events: [
            {
                id: 'e5',
                clubId: '4',
                title: 'Forum Entreprises ENSET',
                description: 'Rencontrez les leaders du marché marocain et trouvez votre stage.',
                date: new Date(Date.now() + 86400000 * 3).toISOString(),
                location: 'ENSET Campus',
                attendees: [MOCK_ADMIN, MOCK_STUDENT, MOCK_USERS[3]],
                isOnline: false,
                isPaid: false,
                guests: [
                    {
                        id: 'g3',
                        name: 'Saad Benjelloun',
                        role: 'DRH',
                        company: 'Groupe OCP'
                    }
                ],
                status: 'upcoming',
                tags: ['Carrière', 'Stage', 'Maroc'],
                coverUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=1000'
            }
        ]
    }
];

