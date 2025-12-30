const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Creating group_join_requests table...');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS group_join_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            reviewed_by TEXT,
            reviewed_at DATETIME,
            FOREIGN KEY (group_id) REFERENCES groups(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(group_id, user_id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating group_join_requests table:', err);
        } else {
            console.log('✓ group_join_requests table created successfully');
        }
    });

    // Create index for faster queries
    db.run(`
        CREATE INDEX IF NOT EXISTS idx_group_join_requests_group 
        ON group_join_requests(group_id)
    `, (err) => {
        if (err) {
            console.error('Error creating index:', err);
        } else {
            console.log('✓ Index created successfully');
        }
    });

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_group_join_requests_user 
        ON group_join_requests(user_id)
    `, (err) => {
        if (err) {
            console.error('Error creating index:', err);
        } else {
            console.log('✓ Index created successfully');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Migration completed successfully');
    }
});
