const http = require('http');

console.log('=== TEST: Le serveur a-t-il été redémarré? ===\n');

// Test la route de test que j'ai ajoutée
http.get('http://localhost:3000/api/test', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✓ SERVEUR REDEMARRÉ AVEC SUCCÈS!');
            console.log('  Réponse:', data);
            console.log('\n>>> Le serveur est prêt pour la messagerie <<<\n');
        } else {
            console.log('✗ Le serveur répond mais avec erreur:', res.statusCode);
        }
    });
}).on('error', (e) => {
    console.log('✗ LE SERVEUR NE RÉPOND PAS');
    console.log('\n>>> VOUS DEVEZ ABSOLUMENT REDEMARRER LE SERVEUR <<<');
    console.log('1. Allez dans le terminal avec "node server/index.js"');
    console.log('2. Appuyez sur Ctrl+C');
    console.log('3. Tapez: node server/index.js');
    console.error('\nErreur:', e.message);
});
