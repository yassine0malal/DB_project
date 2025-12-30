const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

console.log('Recherche complète de références à discussions_old...\n');

// Check ALL database objects
db.all(`
    SELECT type, name, sql 
    FROM sqlite_master 
    WHERE sql LIKE '%discussions_old%'
    ORDER BY type, name
`, (err, objects) => {
    if (err) {
        console.error('Erreur:', err);
        db.close();
        return;
    }
    
    if (objects.length === 0) {
        console.log('✓ Aucune référence à discussions_old trouvée');
    } else {
        console.log(`⚠ ${objects.length} objet(s) trouvé(s):\n`);
        objects.forEach(obj => {
            console.log(`Type: ${obj.type}`);
            console.log(`Nom: ${obj.name}`);
            console.log(`SQL: ${obj.sql}`);
            console.log('---');
        });
    }
    
    // Also check the discussions table schema
    console.log('\nSchéma actuel de discussions:');
    db.all("PRAGMA table_info(discussions)", (err, cols) => {
        if (err) {
            console.error('Erreur:', err);
        } else {
            cols.forEach(c => console.log(`  ${c.name}: ${c.type}`));
        }
        
        // Test a manual insert
        console.log('\nTest d\'insertion manuelle...');
        const testId = 'TEST_' + Date.now();
        db.run(
            "INSERT INTO discussions (id, created_by, created_at) VALUES (?, ?, ?)",
            [testId, '1', new Date().toISOString()],
            function(err) {
                if (err) {
                    console.error('✗ Erreur INSERT:', err.message);
                } else {
                    console.log('✓ INSERT réussi, id:', testId);
                    
                    // Try to add a participant
                    console.log('Test d\'ajout de participant...');
                    db.run(
                        "INSERT INTO discussion_participants (discussion_id, user_id) VALUES (?, ?)",
                        [testId, '1'],
                        function(err) {
                            if (err) {
                                console.error('✗ Erreur participant:', err.message);
                            } else {
                                console.log('✓ Participant ajouté avec succès!');
                            }
                            
                            // Clean up
                            db.run("DELETE FROM discussions WHERE id = ?", [testId]);
                            db.close();
                        }
                    );
                }
            }
        );
    });
});
