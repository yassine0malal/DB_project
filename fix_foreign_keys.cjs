const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

console.log('=== CORRECTION DES FOREIGN KEYS ===\n');

db.serialize(() => {
    console.log('Désactivation des foreign keys...');
    db.run("PRAGMA foreign_keys = OFF");
    
    db.run("BEGIN TRANSACTION");
    
    // 1. Fix discussion_participants
    console.log('\n1. Correction de discussion_participants...');
    db.run("ALTER TABLE discussion_participants RENAME TO discussion_participants_old", (err) => {
        if (err) {
            console.error('Erreur rename:', err);
            db.run("ROLLBACK");
            return;
        }
        
        db.run(`
            CREATE TABLE discussion_participants (
                discussion_id TEXT,
                user_id TEXT,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (discussion_id, user_id),
                FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) {
                console.error('Erreur create:', err);
                db.run("ROLLBACK");
                return;
            }
            
            db.run(`
                INSERT INTO discussion_participants (discussion_id, user_id, joined_at)
                SELECT discussion_id, user_id, joined_at
                FROM discussion_participants_old
            `, (err) => {
                if (err) {
                    console.error('Erreur copy:', err);
                    db.run("ROLLBACK");
                    return;
                }
                
                db.run("DROP TABLE discussion_participants_old", (err) => {
                    if (err) console.error('Erreur drop:', err);
                    else console.log('  ✓ discussion_participants corrigée');
                    
                    // 2. Fix messages
                    console.log('\n2. Correction de messages...');
                    db.run("ALTER TABLE messages RENAME TO messages_old", (err) => {
                        if (err) {
                            console.error('Erreur rename messages:', err);
                            db.run("ROLLBACK");
                            return;
                        }
                        
                        db.run(`
                            CREATE TABLE messages (
                                id TEXT PRIMARY KEY,
                                discussion_id TEXT NOT NULL,
                                author_id TEXT NOT NULL,
                                content TEXT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
                                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
                            )
                        `, (err) => {
                            if (err) {
                                console.error('Erreur create messages:', err);
                                db.run("ROLLBACK");
                                return;
                            }
                            
                            db.run(`
                                INSERT INTO messages (id, discussion_id, author_id, content, created_at)
                                SELECT id, discussion_id, author_id, content, created_at
                                FROM messages_old
                            `, (err) => {
                                if (err) {
                                    console.error('Erreur copy messages:', err);
                                    db.run("ROLLBACK");
                                    return;
                                }
                                
                                db.run("DROP TABLE messages_old", (err) => {
                                    if (err) console.error('Erreur drop messages:', err);
                                    else console.log('  ✓ messages corrigée');
                                    
                                    // Commit
                                    db.run("COMMIT", (err) => {
                                        if (err) {
                                            console.error('\n✗ Erreur commit:', err);
                                        } else {
                                            console.log('\n✓ MIGRATION RÉUSSIE!');
                                            console.log('\nRéactivation des foreign keys...');
                                            db.run("PRAGMA foreign_keys = ON");
                                            
                                            // Test
                                            console.log('\nTest d\'insertion...');
                                            const testId = 'TEST_' + Date.now();
                                            db.run(
                                                "INSERT INTO discussions (id, created_by, created_at) VALUES (?, ?, ?)",
                                                [testId, '1', new Date().toISOString()],
                                                function(err) {
                                                    if (err) {
                                                        console.error('✗ Test failed:', err);
                                                    } else {
                                                        db.run(
                                                            "INSERT INTO discussion_participants (discussion_id, user_id) VALUES (?, ?)",
                                                            [testId, '1'],
                                                            function(err) {
                                                                if (err) {
                                                                    console.error('✗ Participant test failed:', err);
                                                                } else {
                                                                    console.log('✓ Test RÉUSSI! Vous pouvez maintenant envoyer des messages!');
                                                                }
                                                                db.run("DELETE FROM discussions WHERE id = ?", [testId]);
                                                                db.close();
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
