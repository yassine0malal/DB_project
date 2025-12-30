const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("PRAGMA table_info(notifications)", (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Notifications Table Info:', rows);
    }
    db.close();
});
