const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Tables:", tables.map(t => t.name).join(', '));
        
        const tablesToCheck = ['discussions', 'messages', 'contacts', 'discussion_participants'];
        tablesToCheck.forEach(tableName => {
            db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
                if (err) console.error(`Error checking ${tableName}:`, err);
                else {
                    console.log(`\nSchema for ${tableName}:`);
                    columns.forEach(col => console.log(` - ${col.name} (${col.type})`));
                }
            });
        });
    });
});

setTimeout(() => db.close(), 1000);
