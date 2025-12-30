const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.sqlite');

db.all("SELECT id FROM users LIMIT 2", (err, rows) => {
    if (err) {
        console.error("DB Error:", err);
        return;
    }
    
    const u1 = rows[0].id;
    const u2 = rows[1].id;
    console.log(`Testing send message between ${u1} and ${u2}`);

    const postData = JSON.stringify({
        userId1: u1,
        userId2: u2,
        senderId: u1,
        content: "Test message from script"
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/simple-chat/messages/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log("Sending request...");
    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        
        let body = '';
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            console.log('RESPONSE:', body);
            
            // Now try to fetch messages
            console.log('\nFetching messages...');
            const getReq = http.request({
                hostname: 'localhost',
                port: 3000,
                path: `/api/simple-chat/messages/${u1}/${u2}`,
                method: 'GET'
            }, (res2) => {
                console.log(`GET STATUS: ${res2.statusCode}`);
                let body2 = '';
                res2.on('data', (chunk) => {
                    body2 += chunk;
                });
                res2.on('end', () => {
                    console.log('MESSAGES:', body2);
                    process.exit(0);
                });
            });
            getReq.end();
        });
    });

    req.on('error', (e) => {
        console.error(`REQUEST ERROR: ${e.message}`);
        process.exit(1);
    });

    req.write(postData);
    req.end();
});
