import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Users
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ users: rows });
    });
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "User not found" });
        
        let detailsTable = 'students';
        if (row.role === 'teacher') detailsTable = 'teachers';
        if (row.role === 'admin') detailsTable = 'admins';

        db.get(`SELECT * FROM ${detailsTable} WHERE user_id = ?`, [id], (err, details) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ...row, ...details });
        });
    });
});

// Posts (Feed)
app.get('/api/posts', (req, res) => {
    const sql = `
        SELECT posts.*, 
               users.first_name, users.last_name, users.avatar_url, users.role 
        FROM posts 
        JOIN users ON posts.author_id = users.id 
        ORDER BY posts.created_at DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Format for frontend
        const posts = rows.map(post => ({
            id: post.id,
            content: post.content,
            type: post.type,
            imageUrl: post.image_url,
            createdAt: post.created_at,
            likesCount: 0, // TODO: Count from likes table
            commentsCount: 0,
            sharesCount: 0,
            author: {
                id: post.author_id,
                firstName: post.first_name,
                lastName: post.last_name,
                role: post.role,
                avatarUrl: post.avatar_url
            }
        }));
        res.json({ posts });
    });
});

// Create Post
app.post('/api/posts', (req, res) => {
    const { authorId, content, type, groupId, clubId } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();

    const sql = `INSERT INTO posts (id, author_id, content, type, group_id, club_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, authorId, content, type, groupId, clubId, createdAt], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Return the full post object (simplified for now)
        res.json({ id, authorId, content, createdAt, type });
    });
});

// Groups
app.get('/api/groups', (req, res) => {
    db.all("SELECT * FROM groups", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ groups: rows });
    });
});

// Clubs
app.get('/api/clubs', (req, res) => {
    db.all("SELECT * FROM clubs", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ clubs: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
