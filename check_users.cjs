const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("SELECT * FROM users WHERE first_name LIKE '%Lucas%' OR last_name LIKE '%Martin%' OR first_name LIKE '%Amine%'", [], (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
});
