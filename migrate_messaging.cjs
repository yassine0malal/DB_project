const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    // 1. Create discussion_participants table
    db.run(`CREATE TABLE IF NOT EXISTS discussion_participants (
        discussion_id TEXT,
        user_id TEXT,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (discussion_id, user_id),
        FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`, (err) => {
        if (err) console.error('Error creating discussion_participants:', err.message);
        else console.log('Table discussion_participants created successfully');
    });

    // 2. Migration: For existing discussions (if any), add creator as participant
    db.all("SELECT id, created_by FROM discussions", (err, rows) => {
        if (err) {
            console.error('Error fetching discussions:', err.message);
            return;
        }
        rows.forEach(row => {
            if (row.created_by) {
                db.run("INSERT OR IGNORE INTO discussion_participants (discussion_id, user_id) VALUES (?, ?)", [row.id, row.created_by]);
            }
        });
        console.log(`Migrated ${rows.length} discussions.`);
    });
});

setTimeout(() => db.close(), 2000);
