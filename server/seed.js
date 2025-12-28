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

const EVENTS = [
    {
        id: 'e1',
        club_id: '1',
        title: 'Hackathon ENSET v2',
        description: '24h de code non-stop.',
        start_time: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
        location: 'Grand Amphi',
        status: 'upcoming'
    },
    {
        id: 'e2',
        club_id: '1',
        title: 'Workshop React & Node.js',
        description: 'Apprenez les bases du développement web moderne.',
        start_time: new Date(Date.now() + 86400000 * 5).toISOString(), // +5 days
        location: 'Salle B12',
        status: 'upcoming'
    },
    {
        id: 'e3',
        club_id: '2',
        title: 'Démonstration Robotique',
        description: 'Présentation de notre nouveau robot autonome.',
        start_time: new Date(Date.now() + 86400000 * 1).toISOString(), // +1 day
        location: 'Hall Principal',
        status: 'upcoming'
    },
    {
        id: 'e4',
        club_id: '3',
        title: 'Tournoi de Football',
        description: 'Inter-promos.',
        start_time: new Date(Date.now() + 86400000 * 7).toISOString(), // +7 days
        location: 'Terrain de sport',
        status: 'upcoming'
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
        const logError = (ctx) => (err) => { if (err) console.error(`Error in ${ctx}:`, err); };

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
            userStmt.run(user.id, user.email, user.password, user.firstName, user.lastName, user.role, user.avatarUrl, user.bio, (err) => {
                if (err) {
                    console.error(`Error in user ${user.id}:`, err);
                    return;
                }

                // Only insert details if user insert succeeded
                if (user.role === 'student') {
                    studentStmt.run(user.id, user.studentId, user.major, user.level, user.academicYear, user.internshipStatus, logError(`student ${user.id}`));
                } else if (user.role === 'teacher') {
                    teacherStmt.run(user.id, user.title, user.department, user.status, user.officeLocation, user.officeHours, logError(`teacher ${user.id}`));
                } else if (user.role === 'admin') {
                    adminStmt.run(user.id, user.adminRole, user.department, logError(`admin ${user.id}`));
                }
            });
        });

        console.log('Users seeded.');

        // 3. Insert Clubs
        const clubStmt = db.prepare(`INSERT OR REPLACE INTO clubs (id, name, description, category, logo_url, contact_email) VALUES (?, ?, ?, ?, ?, ?)`);
        const clubMemberStmt = db.prepare(`INSERT OR REPLACE INTO club_members (club_id, user_id, role) VALUES (?, ?, ?)`);

        CLUBS.forEach(club => {
            clubStmt.run(club.id, club.name, club.description, club.category, club.logoUrl, club.contactEmail, logError(`club ${club.id}`));
            // Default admin for clubs
            clubMemberStmt.run(club.id, '1', 'admin', logError(`club_member ${club.id}`));
        });
        console.log('Clubs seeded.');

        // 4. Insert Groups
        const groupStmt = db.prepare(`INSERT OR REPLACE INTO groups (id, name, description, type, visibility, created_by, major, academic_year, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        const groupMemberStmt = db.prepare(`INSERT OR REPLACE INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)`);

        GROUPS.forEach(group => {
            groupStmt.run(group.id, group.name, group.description, group.type, group.visibility, group.createdBy, group.major, group.academicYear, group.level, logError(`group ${group.id}`));
            groupMemberStmt.run(group.id, group.createdBy, 'admin', logError(`group_member ${group.id}`));
        });
        console.log('Groups seeded.');

        // Insert Events
        const eventStmt = db.prepare(`INSERT OR REPLACE INTO events (id, club_id, title, description, start_time, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        EVENTS.forEach(event => {
            eventStmt.run(event.id, event.club_id, event.title, event.description, event.start_time, event.location, event.status, logError(`event ${event.id}`));
        });
        console.log('Events seeded.');

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
                post.created_at,
                logError(`post ${post.id}`)
            );
        });
        console.log('Posts seeded with rich content.');

        // 6. Insert Follows (New)
        const followStmt = db.prepare("INSERT OR REPLACE INTO user_follows (follower_id, following_id) VALUES (?, ?)");

        // User 1 follows 2 and 3
        followStmt.run('1', '2', logError('follow 1->2'));
        followStmt.run('1', '3', logError('follow 1->3'));
        // User 2 follows 1
        followStmt.run('2', '1', logError('follow 2->1'));
        // User 3 follows 1 and 2
        followStmt.run('3', '1', logError('follow 3->1'));
        followStmt.run('3', '2', logError('follow 3->2'));
        console.log('User follows seeded.');

        // 7. Insert Visitors (New)
        const visitorStmt = db.prepare("INSERT OR REPLACE INTO visitors (id, email, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)");
        visitorStmt.run('v1', 'visitor@external.com', 'John', 'Doe', '0600000000', logError('visitor v1'));

        // Register Visitor to Event
        const eventVisitorStmt = db.prepare("INSERT OR REPLACE INTO event_visitor_attendance (event_id, visitor_id) VALUES (?, ?)");
        eventVisitorStmt.run('e1', 'v1', logError('event visitor e1->v1'));
        eventVisitorStmt.finalize();
        console.log('Visitors seeded.');

        // 8. Insert Reports (New)
        const reportStmt = db.prepare("INSERT OR REPLACE INTO reports (id, reporter_id, target_id, target_type, reason, status) VALUES (?, ?, ?, ?, ?, ?)");
        reportStmt.run('r1', '2', 'p1', 'post', 'Spam content', 'pending', logError('report r1'));
        console.log('Reports seeded.');

        console.log('Seeding complete! Database ready.');
    });
});
