const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    console.log("Starting migration to fix discussions table...");

    db.run("PRAGMA foreign_keys = OFF;");

    db.run("BEGIN TRANSACTION;");

    // 1. Rename existing table
    db.run("ALTER TABLE discussions RENAME TO discussions_old;", (err) => {
        if (err) {
            console.error("Error renaming table:", err);
            db.run("ROLLBACK;");
            return;
        }
        console.log("Renamed discussions to discussions_old.");

        // 2. Create new table without NOT NULL on group_id
        db.run(`
            CREATE TABLE discussions (
                id TEXT PRIMARY KEY,
                group_id TEXT, 
                title TEXT,
                created_by TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_message_at DATETIME,
                FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
            );
        `, (err) => {
            if (err) {
                console.error("Error creating new table:", err);
                db.run("ROLLBACK;");
                return;
            }
            console.log("Created new discussions table.");

            // 3. Copy data
            db.run(`
                INSERT INTO discussions (id, group_id, title, created_by, created_at, last_message_at)
                SELECT id, group_id, title, created_by, created_at, last_message_at
                FROM discussions_old;
            `, (err) => {
                if (err) {
                    console.error("Error copying data:", err);
                    db.run("ROLLBACK;");
                    return;
                }
                console.log("Copied data.");

                // 4. Drop old table
                db.run("DROP TABLE discussions_old;", (err) => {
                    if (err) {
                        console.error("Error dropping old table:", err);
                        db.run("ROLLBACK;");
                        return;
                    }
                    console.log("Dropped old table.");

                    db.run("COMMIT;", (err) => {
                        if (err) console.error("Error committing:", err);
                        else console.log("Migration successful!");
                        db.run("PRAGMA foreign_keys = ON;");
                    });
                });
            });
        });
    });
});

setTimeout(() => db.close(), 3000);
