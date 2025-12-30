const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

console.log("=== VERIFICATION DE LA BASE DE DONNEES ===\n");

// 1. Check if tables exist
console.log("1. Tables existantes:");
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
    if (err) {
        console.error("Erreur:", err);
        return;
    }
    console.log("Tables:", tables.map(t => t.name).join(', '));
    
    // 2. Check discussions table
    console.log("\n2. Structure de la table 'discussions':");
    db.all("PRAGMA table_info(discussions)", (err, cols) => {
        if (err) {
            console.error("Erreur:", err);
        } else {
            console.log("Colonnes:");
            cols.forEach(col => {
                console.log(`  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}`);
            });
        }
        
        // 3. Check discussion_participants table
        console.log("\n3. Structure de la table 'discussion_participants':");
        db.all("PRAGMA table_info(discussion_participants)", (err, cols) => {
            if (err) {
                console.error("Erreur:", err);
            } else {
                console.log("Colonnes:");
                cols.forEach(col => {
                    console.log(`  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}`);
                });
            }
            
            // 4. Check messages table
            console.log("\n4. Structure de la table 'messages':");
            db.all("PRAGMA table_info(messages)", (err, cols) => {
                if (err) {
                    console.error("Erreur:", err);
                } else {
                    console.log("Colonnes:");
                    cols.forEach(col => {
                        console.log(`  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}`);
                    });
                }
                
                // 5. Count existing data
                console.log("\n5. Données existantes:");
                db.get("SELECT COUNT(*) as count FROM discussions", (err, row) => {
                    if (err) console.error("Erreur discussions:", err);
                    else console.log(`  - Discussions: ${row.count}`);
                });
                
                db.get("SELECT COUNT(*) as count FROM discussion_participants", (err, row) => {
                    if (err) console.error("Erreur participants:", err);
                    else console.log(`  - Participants: ${row.count}`);
                });
                
                db.get("SELECT COUNT(*) as count FROM messages", (err, row) => {
                    if (err) console.error("Erreur messages:", err);
                    else console.log(`  - Messages: ${row.count}`);
                    
                    // 6. Test query to find discussion between two users
                    console.log("\n6. Test: Recherche de discussion entre utilisateurs 1 et 10:");
                    const testSql = `
                        SELECT dp1.discussion_id
                        FROM discussion_participants dp1
                        JOIN discussion_participants dp2 ON dp1.discussion_id = dp2.discussion_id
                        JOIN discussions d ON d.id = dp1.discussion_id
                        WHERE dp1.user_id = ? AND dp2.user_id = ? AND d.group_id IS NULL
                        LIMIT 1
                    `;
                    db.get(testSql, ['1', '10'], (err, row) => {
                        if (err) {
                            console.error("  Erreur:", err.message);
                        } else if (row) {
                            console.log("  ✓ Discussion trouvée:", row.discussion_id);
                        } else {
                            console.log("  ✗ Aucune discussion trouvée (normal si pas encore créée)");
                        }
                        
                        console.log("\n=== FIN DE LA VERIFICATION ===");
                        db.close();
                    });
                });
            });
        });
    });
});
