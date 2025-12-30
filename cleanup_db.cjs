const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

console.log('Nettoyage de la base de données...\n');

// 1. Drop discussions_old if exists
db.run("DROP TABLE IF EXISTS discussions_old", (err) => {
    if (err) {
        console.log('Pas de discussions_old à supprimer (normal)');
    } else {
        console.log('✓ Table discussions_old supprimée');
    }
    
    // 2. List all tables to verify
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%discussion%'", (err, tables) => {
        if (err) {
            console.error('Erreur:', err);
        } else {
            console.log('\nTables discussions:');
            tables.forEach(t => console.log('  -', t.name));
        }
        
        // 3. Check for triggers that might reference discussions_old
        db.all("SELECT name, sql FROM sqlite_master WHERE type='trigger' AND sql LIKE '%discussions_old%'", (err, triggers) => {
            if (err) {
                console.error('Erreur triggers:', err);
            } else if (triggers.length > 0) {
                console.log('\n⚠ Triggers trouvés qui référencent discussions_old:');
                triggers.forEach(t => {
                    console.log('  -', t.name);
                    db.run(`DROP TRIGGER IF EXISTS ${t.name}`, (err) => {
                        if (err) console.error('    Erreur suppression:', err);
                        else console.log('    ✓ Trigger supprimé');
                    });
                });
            } else {
                console.log('\n✓ Aucun trigger problématique');
            }
            
            console.log('\nNettoyage terminé!');
            
            setTimeout(() => {
                db.close();
                process.exit(0);
            }, 1000);
        });
    });
});
