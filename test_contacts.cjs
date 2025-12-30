const http = require('http');
const sqlite3 = require('sqlite3').verbose();

// 1. Get a user ID from DB
const db = new sqlite3.Database('database.sqlite');
db.get("SELECT id FROM users LIMIT 1", (err, row) => {
    if (err) { console.error(err); return; }
    const userId = row.id;
    console.log(`Testing contacts for user: ${userId}`);
    db.close();

    // 2. Test the endpoint
    http.get(`http://localhost:3000/api/simple-chat/contacts/${userId}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`STATUS: ${res.statusCode}`);
            if (res.statusCode === 200) {
                const json = JSON.parse(data);
                console.log(`Contacts found: ${json.contacts.length}`);
                if (json.contacts.length > 0) {
                    console.log('Sample contact:', json.contacts[0]);
                }
            } else {
                console.log('Response:', data);
            }
        });
    }).on('error', e => console.error(e));
});
