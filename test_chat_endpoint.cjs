const fetch = require('node-fetch');

async function testStartChat() {
    console.log("Testing POST /api/discussions/start...");
    try {
        const response = await fetch('http://localhost:3000/api/discussions/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId1: 'USER_ID_1', // We need valid IDs, but let's try with placeholders first or grab from DB if possible
                userId2: 'USER_ID_2' 
            })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

// We need valid user IDs for the SQL to actually run deep enough to fail
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("SELECT id FROM users LIMIT 2", (err, rows) => {
    if (err) {
        console.error("DB Error:", err);
        return;
    }
    if (rows.length < 2) {
        console.error("Not enough users to test.");
        return;
    }
    const u1 = rows[0].id;
    const u2 = rows[1].id;
    console.log(`Using users: ${u1}, ${u2}`);
    
    // Now run the fetch
    // Note: We need to use dynamic import for node-fetch or just use http module if node-fetch isn't available
    // simpler to use http for zero-dependency
    
    const http = require('http');
    const data = JSON.stringify({ userId1: u1, userId2: u2 });
    
    const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/discussions/start',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });
    
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    
    req.write(data);
    req.end();
    
    setTimeout(() => db.close(), 1000);
});
