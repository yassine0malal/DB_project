const sqlite3 = require('sqlite3').verbose();
const http = require('http');

console.log("Opening DB...");
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error("DB Open Error:", err);
        process.exit(1);
    }
});

db.all("SELECT id FROM users LIMIT 2", (err, rows) => {
    if (err) {
        console.error("DB Query Error:", err);
        process.exit(1);
    }
    if (!rows || rows.length < 2) {
        console.log("Not enough users found to test chat.");
        process.exit(0);
    }

    const u1 = rows[0].id;
    const u2 = rows[1].id;
    console.log(`Testing with Users: ${u1} and ${u2}`);

    const postData = JSON.stringify({
        userId1: u1,
        userId2: u2
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/discussions/start',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log("Sending Request...");
    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            console.log('BODY:', body);
            process.exit(0);
        });
    });

    req.on('error', (e) => {
        console.error(`REQUEST ERROR: ${e.message}`);
        console.log("Is the server running on port 3000?");
        process.exit(1);
    });

    req.write(postData);
    req.end();
});
