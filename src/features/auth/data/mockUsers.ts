import { StudentProfile, TeacherProfile, AdminProfile, User } from '../types';

export const MOCK_STUDENT: StudentProfile = {
    id: '1',
    email: 'amine.alami@enset-media.ac.ma',
    firstName: 'Amine',
    lastName: 'El Alami',
    role: 'student',
    studentId: '20230156',
    major: 'Génie Informatique',
    level: 'M1',
    academicYear: '2024-2025',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200&h=300',
    createdAt: new Date().toISOString(),
    followers: [],
    following: [],
    bio: "Passionné par le développement web et l'intelligence artificielle. Étudiant à l'ENSET Mohammedia, toujours prêt pour un hackathon !",
    skills: ['React', 'Node.js', 'Python', 'TailwindCSS'],
    interests: ['Entreprenariat', 'Open Source', 'Football'],
    internshipStatus: 'seeking_internship',
    socialLinks: {
        linkedin: 'https://linkedin.com/in/aminealami',
        github: 'https://github.com/aminealami'
    },
    projects: [
        { title: 'EnsetReseux', description: 'Plateforme sociale pour les étudiants de l\'ENSET', url: '#' },
        { title: 'SmartCity Casa', description: 'Application mobile pour le transport urbain', url: '#' }
    ]
};

export const MOCK_TEACHER: TeacherProfile = {
    id: '2',
    email: 'fatima.bennani@enset-media.ac.ma',
    firstName: 'Fatima Zahra',
    lastName: 'Bennani',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    coverUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200&h=300',
    createdAt: new Date().toISOString(),
    followers: [],
    following: [],
    title: 'Dr.',
    department: 'Génie Informatique',
    status: 'permanent',
    officeLocation: 'Département Informatique, Bureau 12',
    officeHours: 'Lundi 10h-12h, Mercredi 15h-17h',
    subjects: ['Base de données', 'Algorithmique Avancée', 'Architectures Cloud'],
    bio: "Professeure à l'ENSET Mohammedia. Chercheuse en Big Data et systèmes distribués. Passionnée par la transmission du savoir.",
    currentResearch: "Analyse prédictive des flux de données massifs pour le secteur bancaire marocain",
    publications: ['Big Data in Morocco (2023)', 'Cloud Security (2022)', 'IoT Analytics (2024)'],
    mentorshipAvailable: true,
    socialLinks: {
        linkedin: 'https://linkedin.com/in/fatimabennani',
        website: 'https://bennani-lab.ma'
    }
};

export const MOCK_ADMIN: AdminProfile = {
    id: '3',
    email: 'admin.dsi@enset-media.ac.ma',
    firstName: 'Youssef',
    lastName: 'Mansouri',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=300',
    createdAt: new Date().toISOString(),
    followers: [],
    following: [],
    adminRole: 'Responsable DSI',
    department: 'Direction du Système d\'Information',
    availabilityHours: 'Lun-Ven 8:30-16:30',
    emergencyContact: '+212 5 23 32 22 22',
    responsibilities: ['Gestion du parc informatique', 'Sécurité réseau', 'Supports pédagogiques numériques']
};

export const MOCK_USERS: User[] = [
    MOCK_STUDENT,
    MOCK_TEACHER,
    MOCK_ADMIN,
    {
        id: '4',
        email: 'salma.tazi@enset-media.ac.ma',
        firstName: 'Salma',
        lastName: 'Tazi',
        role: 'student',
        studentId: '20230099',
        major: 'Génie Logiciel',
        level: 'M2',
        academicYear: '2024-2025',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
        createdAt: new Date().toISOString(),
        followers: [],
        following: []
    } as User,
    {
        id: '5',
        email: 'khadija.rayan@enset-media.ac.ma',
        firstName: 'Khadija',
        lastName: 'Rayan',
        role: 'student',
        studentId: '20230001',
        major: 'Génie Électrique',
        level: 'M1',
        academicYear: '2024-2025',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
        createdAt: new Date().toISOString(),
        followers: [],
        following: []
    } as User,
    {
        id: '6',
        email: 'yassine.idrissi@enset-media.ac.ma',
        firstName: 'Yassine',
        lastName: 'Idrissi',
        role: 'student',
        studentId: '20230002',
        major: 'Génie Mécanique',
        level: 'L3',
        academicYear: '2024-2025',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
        createdAt: new Date().toISOString(),
        followers: [],
        following: []
    } as User
];
