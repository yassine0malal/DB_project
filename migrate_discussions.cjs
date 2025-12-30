const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    // Check if column exists
    db.all("PRAGMA table_info(discussions)", (err, columns) => {
        if (err) {
            console.error("Error fetching table info:", err);
            return;
        }

        const hasColumn = columns.some(c => c.name === 'last_message_at');
        if (!hasColumn) {
            console.log("Adding last_message_at column to discussions table...");
            db.run("ALTER TABLE discussions ADD COLUMN last_message_at DATETIME", (err) => {
                if (err) {
                    console.error("Error adding column:", err);
                    return;
                }
                console.log("Column added.");
                
                // Backfill
                console.log("Backfilling last_message_at...");
                db.run(`
                    UPDATE discussions 
                    SET last_message_at = COALESCE(
                        (SELECT MAX(created_at) FROM messages WHERE discussion_id = discussions.id),
                        created_at
                    )
                `, (err) => {
                    if (err) console.error("Error backfilling:", err);
                    else console.log("Backfill complete.");
                });
            });
        } else {
            console.log("Column last_message_at already exists.");
        }
    });
});

setTimeout(() => db.close(), 2000);
