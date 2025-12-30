import db from './db.js';

const runQuery = (sql) => {
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const ensureTables = async () => {
    console.log('Ensuring tables...');
    try {
        // 1. Discussions
        // Adding last_message_at for sorting conversations by most recent activity
        await runQuery(`
            CREATE TABLE IF NOT EXISTS discussions (
                id TEXT PRIMARY KEY,
                group_id TEXT,
                title TEXT,
                created_by TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "discussions" ensured.');

        // 2. Discussion Participants
        await runQuery(`
            CREATE TABLE IF NOT EXISTS discussion_participants (
                discussion_id TEXT,
                user_id TEXT,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (discussion_id, user_id),
                FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "discussion_participants" ensured.');

        // 3. Messages
        await runQuery(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                discussion_id TEXT NOT NULL,
                author_id TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "messages" ensured.');

        // 4. Contacts (Simplified relationship)
        await runQuery(`
            CREATE TABLE IF NOT EXISTS contacts (
                user_id TEXT NOT NULL,
                contact_id TEXT NOT NULL,
                status TEXT CHECK(status IN ('pending', 'accepted', 'blocked')) DEFAULT 'accepted',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, contact_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (contact_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "contacts" ensured.');

        console.log('Schema update complete.');
    } catch (err) {
        console.error('Error ensuring tables:', err.message);
    } finally {
        // Give some time for queries to finish before exiting
        setTimeout(() => process.exit(0), 1000);
    }
};

ensureTables();
