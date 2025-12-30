const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const users = [
    {
        id: 'user_alice',
        email: 'alice@n7.fr',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Martin',
        role: 'student',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    },
    {
        id: 'user_bob',
        email: 'bob@n7.fr',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Dubois',
        role: 'student',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    },
    {
        id: 'user_charlie',
        email: 'charlie@n7.fr',
        password: 'password123',
        firstName: 'Charlie',
        lastName: 'Moreau',
        role: 'teacher',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
    }
];

db.serialize(() => {
    const stmtUser = db.prepare("INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, role, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)");
    const stmtStudent = db.prepare("INSERT OR IGNORE INTO students (user_id, student_id, major, level, academic_year) VALUES (?, ?, ?, ?, ?)");
    const stmtTeacher = db.prepare("INSERT OR IGNORE INTO teachers (user_id, title, department, subjects, office_location, office_hours, status) VALUES (?, ?, ?, ?, ?, ?, ?)");

    users.forEach(user => {
        stmtUser.run(user.id, user.email, user.password, user.firstName, user.lastName, user.role, user.avatarUrl, (err) => {
            if (err) console.error(`Error inserting user ${user.firstName}:`, err.message);
            else console.log(`Inserted user: ${user.firstName}`);
        });

        if (user.role === 'student') {
            stmtStudent.run(user.id, 'STU' + Math.floor(Math.random() * 1000), 'Informatique', 'L3', '2024-2025');
        } else if (user.role === 'teacher') {
            stmtTeacher.run(user.id, 'Dr.', 'Informatique', 'BD, Web', 'B102', 'Lundi 14h-16h', 'permanent');
        }
    });

    stmtUser.finalize();
    stmtStudent.finalize();
    stmtTeacher.finalize();

    console.log("Seeding complete.");
});

db.close();
