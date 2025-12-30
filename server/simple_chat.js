import express from 'express';
import db from './db.js';

const router = express.Router();

// Get messages between two users
router.get('/messages/:userId1/:userId2', (req, res) => {
    const { userId1, userId2 } = req.params;
    
    const sql = `
        SELECT m.*, u.first_name, u.last_name, u.avatar_url
        FROM messages m
        JOIN discussions d ON m.discussion_id = d.id
        JOIN discussion_participants p1 ON p1.discussion_id = d.id AND p1.user_id = ?
        JOIN discussion_participants p2 ON p2.discussion_id = d.id AND p2.user_id = ?
        JOIN users u ON m.author_id = u.id
        WHERE d.group_id IS NULL
        ORDER BY m.created_at ASC
    `;
    
    db.all(sql, [userId1, userId2], (err, rows) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ messages: rows || [] });
    });
});

// Send a message
router.post('/messages/send', (req, res) => {
    const { userId1, userId2, content, senderId } = req.body;
    
    if (!userId1 || !userId2 || !content || !senderId) {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    
    // First, find or create discussion
    const findSql = `
        SELECT dp1.discussion_id
        FROM discussion_participants dp1
        JOIN discussion_participants dp2 ON dp1.discussion_id = dp2.discussion_id
        JOIN discussions d ON d.id = dp1.discussion_id
        WHERE dp1.user_id = ? AND dp2.user_id = ? AND d.group_id IS NULL
        LIMIT 1
    `;
    
    db.get(findSql, [userId1, userId2], (err, row) => {
        if (err) {
            console.error('Error finding discussion:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (row) {
            // Discussion exists, insert message
            insertMessage(row.discussion_id, senderId, content, res);
        } else {
           // Create new discussion
            const discussionId = Math.random().toString(36).substr(2, 9);
            const createdAt = new Date().toISOString();
            
            db.run(
                "INSERT INTO discussions (id, created_by, created_at, last_message_at) VALUES (?, ?, ?, ?)",
                [discussionId, senderId, createdAt, createdAt],
                function(err) {
                    if (err) {
                        console.error('Error creating discussion:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    
                    // Add both participants
                    db.run(
                        "INSERT INTO discussion_participants (discussion_id, user_id) VALUES (?, ?)",
                        [discussionId, userId1],
                        function(err) {
                            if (err) {
                                console.error('Error adding participant 1:', err);
                                return res.status(500).json({ error: err.message });
                            }
                            
                            db.run(
                                "INSERT INTO discussion_participants (discussion_id, user_id) VALUES (?, ?)",
                                [discussionId, userId2],
                                function(err) {
                                    if (err) {
                                        console.error('Error adding participant 2:', err);
                                        return res.status(500).json({ error: err.message });
                                    }
                                    
                                    // Now insert the message
                                    insertMessage(discussionId, senderId, content, res);
                                }
                            );
                        }
                    );
                }
            );
        }
    });
});

function insertMessage(discussionId, authorId, content, res) {
    const messageId = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    db.run(
        "INSERT INTO messages (id, discussion_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)",
        [messageId, discussionId, authorId, content, createdAt],
        function(err) {
            if (err) {
                console.error('Error inserting message:', err);
                return res.status(500).json({ error: err.message });
            }
            
            // Update discussion last_message_at
            db.run(
                "UPDATE discussions SET last_message_at = ? WHERE id = ?",
                [createdAt, discussionId],
                function(err) {
                    if (err) console.error('Error updating discussion:', err);
                }
            );
            
            res.json({
                success: true,
                message: {
                    id: messageId,
                    content,
                    created_at: createdAt,
                    author_id: authorId
                }
            });
        }
    );
}

export default router;
