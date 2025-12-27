import { Group } from '../types';
import { MOCK_STUDENT, MOCK_TEACHER, MOCK_USERS } from '../../auth/data/mockUsers';

export const mockGroups: Group[] = [
    {
        id: 'g1',
        name: 'Squad Informatique 🔥',
        description: 'Le groupe des meilleurs amis de la filière Génie Informatique. On partage tout : cours, sorties, et bons plans !',
        type: 'friends',
        visibility: 'private',
        coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200&h=400',
        createdAt: new Date(2024, 0, 15).toISOString(),
        createdBy: MOCK_STUDENT,
        members: [
            { user: MOCK_STUDENT, role: 'admin', joinedAt: new Date(2024, 0, 15).toISOString() },
            { user: MOCK_USERS[3], role: 'member', joinedAt: new Date(2024, 0, 16).toISOString() },
            { user: MOCK_USERS[4], role: 'member', joinedAt: new Date(2024, 0, 17).toISOString() },
            { user: MOCK_USERS[5], role: 'member', joinedAt: new Date(2024, 0, 20).toISOString() }
        ],
        posts: [
            {
                id: 'gp1',
                type: 'text',
                content: "Qui est partant pour le café demain matin avant le cours de BDD ? ☕",
                author: MOCK_STUDENT,
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
                likesCount: 4,
                commentsCount: 6,
                sharesCount: 0,
                comments: []
            },
            {
                id: 'gp2',
                type: 'image',
                content: "Souvenir de notre sortie à Casablanca le weekend dernier ! 🌊",
                imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=1000',
                author: MOCK_USERS[3],
                createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
                likesCount: 12,
                commentsCount: 3,
                sharesCount: 1,
                comments: []
            }
        ],
        rules: [
            'Ce qui se passe dans le groupe reste dans le groupe 🤫',
            'Pas de spam ni de publicités',
            'Entraide obligatoire pour les TDs et TPs'
        ]
    },
    {
        id: 'g2',
        name: 'Coloc Résidence Al Firdaouss 🏠',
        description: 'Groupe des colocataires de la résidence Al Firdaouss. Gestion des charges, courses communes et règles de vie.',
        type: 'apartment',
        visibility: 'private',
        coverUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200&h=400',
        createdAt: new Date(2024, 8, 1).toISOString(),
        createdBy: MOCK_USERS[4],
        members: [
            { user: MOCK_USERS[4], role: 'admin', joinedAt: new Date(2024, 8, 1).toISOString() },
            { user: MOCK_USERS[5], role: 'moderator', joinedAt: new Date(2024, 8, 2).toISOString() },
            { user: MOCK_STUDENT, role: 'member', joinedAt: new Date(2024, 8, 5).toISOString() }
        ],
        posts: [
            {
                id: 'gp3',
                type: 'text',
                content: "📢 Rappel : Les charges d'eau et d'électricité sont à payer avant le 5 du mois. Total par personne : 150 DH",
                author: MOCK_USERS[4],
                createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
                likesCount: 2,
                commentsCount: 1,
                sharesCount: 0,
                comments: []
            },
            {
                id: 'gp4',
                type: 'poll',
                content: "On fait les courses ce weekend, qu'est-ce qu'on prend ?",
                author: MOCK_USERS[5],
                poll: {
                    question: "Articles à acheter",
                    options: [
                        { id: '1', label: 'Produits ménagers', votes: 3 },
                        { id: '2', label: 'Épicerie de base', votes: 2 },
                        { id: '3', label: 'Fruits et légumes', votes: 3 }
                    ],
                    totalVotes: 8
                },
                createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
                likesCount: 1,
                commentsCount: 4,
                sharesCount: 0,
                comments: []
            }
        ],
        rules: [
            'Respecter le silence après 22h',
            'Nettoyer les espaces communs chaque weekend',
            'Prévenir 24h à l\'avance pour les invités',
            'Payer les charges avant le 5 de chaque mois'
        ]
    },
    {
        id: 'g3',
        name: 'Promo M1 GI 2024-2025 🎓',
        description: 'Groupe officiel de la promotion M1 Génie Informatique 2024-2025. Annonces, cours, et entraide académique.',
        type: 'class',
        visibility: 'public',
        coverUrl: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&q=80&w=1200&h=400',
        createdAt: new Date(2024, 8, 10).toISOString(),
        createdBy: MOCK_TEACHER,
        academicYear: '2024-2025',
        major: 'Génie Informatique',
        level: 'M1',
        members: [
            { user: MOCK_TEACHER, role: 'admin', joinedAt: new Date(2024, 8, 10).toISOString() },
            { user: MOCK_STUDENT, role: 'moderator', joinedAt: new Date(2024, 8, 11).toISOString() },
            { user: MOCK_USERS[3], role: 'member', joinedAt: new Date(2024, 8, 11).toISOString() },
            { user: MOCK_USERS[4], role: 'member', joinedAt: new Date(2024, 8, 12).toISOString() },
            { user: MOCK_USERS[5], role: 'member', joinedAt: new Date(2024, 8, 12).toISOString() }
        ],
        posts: [
            {
                id: 'gp5',
                type: 'text',
                content: "📚 Le cours de Machine Learning de demain est reporté à jeudi 14h. Préparez vos questions sur les SVM !",
                author: MOCK_TEACHER,
                createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
                likesCount: 24,
                commentsCount: 8,
                sharesCount: 2,
                comments: []
            },
            {
                id: 'gp6',
                type: 'text',
                content: "🆘 Quelqu'un a le corrigé du TD3 d'Architecture Logicielle ? J'ai du mal avec les patterns Factory et Builder.",
                author: MOCK_USERS[3],
                createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
                likesCount: 5,
                commentsCount: 12,
                sharesCount: 0,
                comments: []
            }
        ],
        rules: [
            'Contenu académique uniquement',
            'Partager les ressources de manière équitable',
            'Respecter les délégués et les professeurs',
            'Pas de triche ni de plagiat'
        ]
    },
    {
        id: 'g4',
        name: 'Équipe Web Dev - Club Coding',
        description: 'Sous-groupe du Club Coding dédié au développement web. React, Vue, Angular, et tout le stack moderne !',
        type: 'club',
        visibility: 'public',
        coverUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1200&h=400',
        createdAt: new Date(2024, 2, 1).toISOString(),
        createdBy: MOCK_STUDENT,
        parentClubId: '1',
        parentClubName: 'Club Coding ENSET',
        members: [
            { user: MOCK_STUDENT, role: 'admin', joinedAt: new Date(2024, 2, 1).toISOString() },
            { user: MOCK_USERS[3], role: 'moderator', joinedAt: new Date(2024, 2, 5).toISOString() },
            { user: MOCK_USERS[4], role: 'member', joinedAt: new Date(2024, 2, 10).toISOString() }
        ],
        posts: [
            {
                id: 'gp7',
                type: 'image',
                content: "🚀 Session de code en live ! On construit un clone de Twitter avec Next.js 14. Rejoignez-nous !",
                imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
                author: MOCK_STUDENT,
                createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
                likesCount: 34,
                commentsCount: 15,
                sharesCount: 5,
                comments: []
            }
        ],
        rules: [
            'Coder proprement et commenter son code',
            'Partager les connaissances',
            'Participer aux sessions hebdomadaires'
        ]
    },
    {
        id: 'g5',
        name: 'Promo L3 Génie Électrique 🔌',
        description: 'Groupe de la promotion L3 Génie Électrique. Partage de cours, exercices et préparation aux examens.',
        type: 'class',
        visibility: 'public',
        coverUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200&h=400',
        createdAt: new Date(2024, 8, 12).toISOString(),
        createdBy: MOCK_USERS[4],
        academicYear: '2024-2025',
        major: 'Génie Électrique',
        level: 'L3',
        members: [
            { user: MOCK_USERS[4], role: 'admin', joinedAt: new Date(2024, 8, 12).toISOString() },
            { user: MOCK_USERS[5], role: 'member', joinedAt: new Date(2024, 8, 13).toISOString() }
        ],
        posts: [
            {
                id: 'gp8',
                type: 'text',
                content: "📝 Le contrôle d'Électronique de Puissance est programmé pour vendredi prochain. Révisez bien les convertisseurs !",
                author: MOCK_USERS[4],
                createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
                likesCount: 8,
                commentsCount: 4,
                sharesCount: 1,
                comments: []
            }
        ],
        rules: [
            'Entraide académique uniquement',
            'Partager les annales d\'examens'
        ]
    }
];
