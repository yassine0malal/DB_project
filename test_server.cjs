const http = require('http');

console.log("Test de connexion au serveur...");

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/simple-chat/messages/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`Est-ce que le serveur répond? ${res.statusCode === 404 || res.statusCode === 400 ? 'OUI (route existe)' : 'NON (serveur problème)'}`);
    
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('BODY:', body.substring(0, 200));
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error(`LE SERVEUR NE REPOND PAS: ${e.message}`);
    console.log('\n>>> VOUS DEVEZ REDEMARRER LE SERVEUR <<<');
    console.log('1. Ctrl+C dans le terminal du serveur');
    console.log('2. Puis: node server/index.js');
    process.exit(1);
});

req.write(JSON.stringify({test: 'data'}));
req.end();
