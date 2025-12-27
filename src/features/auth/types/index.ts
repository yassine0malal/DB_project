export type UserRole = 'student' | 'teacher' | 'admin';

interface BaseUser {
    id: string;
    email: string; // Email universitaire
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string; // Photo de profil
    coverUrl?: string;
    createdAt: string;
    followers: string[]; // User IDs
    following: string[]; // User IDs
}

export interface StudentProfile extends BaseUser {
    role: 'student';
    // Obligatoire
    studentId: string; // Numéro étudiant (vérifié)
    major: string; // Filière
    level: string; // L1, L2, M1, etc.
    academicYear: string; // Année universitaire

    // Optionnel
    bio?: string;
    skills?: string[]; // Compétences techniques
    interests?: string[]; // Intérêts académiques
    projects?: { title: string; description: string; url?: string }[];
    socialLinks?: { linkedin?: string; github?: string; website?: string };
    internshipStatus?: 'seeking_internship' | 'seeking_alternance' | 'open_to_opportunities' | 'not_looking';
}

export interface TeacherProfile extends BaseUser {
    role: 'teacher';
    // Obligatoire
    title: string; // Dr., Prof., etc.
    department: string;
    subjects: string[]; // Matières enseignées
    officeLocation: string; // Bureau localisation
    officeHours: string; // Heures de permanence
    status: 'permanent' | 'vacataire';

    // Optionnel
    bio?: string; // Biographie académique
    publications?: string[]; // Publications récentes
    currentResearch?: string; // Recherches en cours
    mentorshipAvailable?: boolean;
    socialLinks?: { linkedin?: string; website?: string };
}

export interface AdminProfile extends BaseUser {
    role: 'admin';
    // Spécifique
    adminRole: string; // Rôle administratif
    department: string; // Département responsable
    bio?: string;
    emergencyContact: string; // Visibilité réduite
    availabilityHours: string; // Horaires de disponibilité
    responsibilities: string[]; // Zones de responsabilité
}

export type User = StudentProfile | TeacherProfile | AdminProfile;

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    followUser: (targetUserId: string) => void;
    unfollowUser: (targetUserId: string) => void;
}
