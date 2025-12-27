import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.resolve(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

const USERS = [
    {
        id: '1',
        email: 'amine.alami@enset-media.ac.ma',
        password: 'password123',
        firstName: 'Amine',
        lastName: 'El Alami',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        bio: 'Passionné par le développement web et l\'IA.',
        studentId: '20230156',
        major: 'Génie Informatique',
        level: 'M1',
        academicYear: '2024-2025',
        internshipStatus: 'seeking_internship'
    },
    {
        id: '2',
        email: 'fatima.bennani@enset-media.ac.ma',
        password: 'password123',
        firstName: 'Fatima Zahra',
        lastName: 'Bennani',
        role: 'teacher',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        title: 'Dr.',
        department: 'Génie Informatique',
        status: 'permanent',
        officeLocation: 'Bureau 12',
        officeHours: 'Lundi 10h-12h'
    },
    {
        id: '3',
        email: 'yassine.idrissi@enset-media.ac.ma',
        password: 'password123',
        firstName: 'Yassine',
        lastName: 'Idrissi',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        bio: 'Futur ingénieur mécanique. Fan de robotique.',
        studentId: '20230002',
        major: 'Génie Mécanique',
        level: 'L3',
        academicYear: '2024-2025',
        internshipStatus: 'not_looking'
    },
    {
        id: '4',
        email: 'salma.tazi@enset-media.ac.ma',
        password: 'password123',
        firstName: 'Salma',
        lastName: 'Tazi',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
        bio: 'Développeuse Fullstack en herbe.',
        studentId: '20230099',
        major: 'Génie Logiciel',
        level: 'M2',
        academicYear: '2024-2025',
        internshipStatus: 'seeking_alternance'
    },
    {
        id: '5',
        email: 'admin.dsi@enset-media.ac.ma',
        password: 'password123',
        firstName: 'Youssef',
        lastName: 'Mansouri',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        adminRole: 'Directeur DSI',
        department: 'IT Support'
    }
];

const CLUBS = [
    {
        id: '1',
        name: 'Club Coding ENSET',
        description: 'Le club des passionnés de programmation.',
        category: 'Tech',
        logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        contactEmail: 'coding@enset.ma'
    },
    {
        id: '2',
        name: 'Enset Robotique',
        description: 'Conception et réalisation de robots.',
        category: 'Engineering',
        logoUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
        contactEmail: 'robot@enset.ma'
    },
    {
        id: '3',
        name: 'Club Sportif',
        description: 'Mens sana in corpore sano.',
        category: 'Sport',
        logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
        contactEmail: 'sport@enset.ma'
    }
];

const GROUPS = [
    {
        id: 'g1',
        name: 'Squad Informatique',
        description: 'Meilleurs amis GI.',
        type: 'friends',
        visibility: 'private',
        createdBy: '1'
    },
    {
        id: 'g2',
        name: 'Promo GI 2025',
        description: 'Groupe officiel de la promo.',
        type: 'class',
        visibility: 'public',
        createdBy: '2',
        major: 'Génie Informatique',
        academicYear: '2024-2025',
        level: 'M1'
    }
];

const POSTS = [
    {
        id: 'p1',
        author_id: '1',
        content: 'Incroyable hackathon ce week-end ! Merci à tous les participants. 🚀',
        image_url: 'https://images.unsplash.com/photo-1504384308090-c54be3855833',
        type: 'image',
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'p2',
        author_id: '2',
        content: 'Rappel : Le cours de Big Data aura lieu en salle B12 demain à 9h.',
        type: 'text',
        group_id: 'g2',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
        id: 'p3',
        author_id: '3',
        content: 'Notre robot a gagné le premier prix ! 🏆',
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        type: 'image',
        club_id: '2',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
        id: 'p4',
        author_id: '4',
        content: 'Je cherche un stage en React/Node.js pour cet été. Des pistes ? 🙏',
        type: 'text',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
        id: 'p5',
        author_id: '5',
        content: 'Maintenance prévue du réseau WiFi ce samedi de 14h à 16h.',
        type: 'text',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
    }
];

// ... (previous imports and definition of USERS, CLUBS, GROUPS, POSTS)

db.serialize(() => {
    // 1. Run Schema
    db.exec(schema, (err) => {
        if (err) {
            console.error('Schema execution failed:', err);
            return;
        }
        console.log('Schema executed successfully.');

        // 2. Insert Users
        const userStmt = db.prepare(`INSERT OR REPLACE INTO users (id, email, password_hash, first_name, last_name, role, avatar_url, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        const studentStmt = db.prepare(`INSERT OR REPLACE INTO students (user_id, student_id, major, level, academic_year, internship_status) VALUES (?, ?, ?, ?, ?, ?)`);
        const teacherStmt = db.prepare(`INSERT OR REPLACE INTO teachers (user_id, title, department, status, office_location, office_hours) VALUES (?, ?, ?, ?, ?, ?)`);
        const adminStmt = db.prepare(`INSERT OR REPLACE INTO admins (user_id, admin_role, department) VALUES (?, ?, ?)`);

        USERS.forEach(user => {
            userStmt.run(user.id, user.email, user.password, user.firstName, user.lastName, user.role, user.avatarUrl, user.bio);
            if (user.role === 'student') {
                studentStmt.run(user.id, user.studentId, user.major, user.level, user.academicYear, user.internshipStatus);
            } else if (user.role === 'teacher') {
                teacherStmt.run(user.id, user.title, user.department, user.status, user.officeLocation, user.officeHours);
            } else if (user.role === 'admin') {
                adminStmt.run(user.id, user.adminRole, user.department);
            }
        });
        userStmt.finalize();
        studentStmt.finalize();
        teacherStmt.finalize();
        adminStmt.finalize();
        console.log('Users seeded.');

        // 3. Insert Clubs
        const clubStmt = db.prepare(`INSERT OR REPLACE INTO clubs (id, name, description, category, logo_url, contact_email) VALUES (?, ?, ?, ?, ?, ?)`);
        const clubMemberStmt = db.prepare(`INSERT OR REPLACE INTO club_members (club_id, user_id, role) VALUES (?, ?, ?)`);
        
        CLUBS.forEach(club => {
            clubStmt.run(club.id, club.name, club.description, club.category, club.logoUrl, club.contactEmail);
            // Default admin for clubs
            clubMemberStmt.run(club.id, '1', 'admin'); 
        });
        clubStmt.finalize();
        clubMemberStmt.finalize();
        console.log('Clubs seeded.');

        // 4. Insert Groups
        const groupStmt = db.prepare(`INSERT OR REPLACE INTO groups (id, name, description, type, visibility, created_by, major, academic_year, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        const groupMemberStmt = db.prepare(`INSERT OR REPLACE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)`);
        
        GROUPS.forEach(group => {
            groupStmt.run(group.id, group.name, group.description, group.type, group.visibility, group.createdBy, group.major, group.academicYear, group.level);
            groupMemberStmt.run(group.id, group.createdBy, 'admin');
        });
        groupStmt.finalize();
        groupMemberStmt.finalize();
        console.log('Groups seeded.');

        // 5. Insert Posts
        const postStmt = db.prepare(`INSERT OR REPLACE INTO posts (id, author_id, content, type, image_url, group_id, club_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        
        POSTS.forEach(post => {
            postStmt.run(
                post.id, 
                post.author_id, 
                post.content, 
                post.type, 
                post.image_url || null, 
                post.group_id || null, 
                post.club_id || null, 
                post.created_at
            );
        });
        postStmt.finalize();
        console.log('Posts seeded with rich content.');

        console.log('Seeding complete! Database ready.');
    });
});
