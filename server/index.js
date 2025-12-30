import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Auth
app.post('/api/auth/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(400).json({ error: "Email already exists" });

        const id = Math.random().toString(36).substr(2, 9);
        const createdAt = new Date().toISOString();
        const role = 'student'; // Default role

        db.serialize(() => {
            // Insert User
            db.run("INSERT INTO users (id, email, password, first_name, last_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [id, email, password, firstName, lastName, role, createdAt],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    // Insert Student Profile (Default)
                    const studentId = 'STU' + Math.floor(Math.random() * 10000);
                    db.run("INSERT INTO students (user_id, student_id, major, level, academic_year) VALUES (?, ?, ?, ?, ?)",
                        [id, studentId, 'Informatique', 'L1', '2024-2025'],
                        function (err) {
                            if (err) return res.status(500).json({ error: err.message });
                            
                            res.json({
                                message: "User registered successfully",
                                user: { id, email, firstName, lastName, role }
                            });
                        }
                    );
                }
            );
        });
    });
});

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

        // Get role details
        db.get(`SELECT * FROM ${detailsTable} WHERE user_id = ?`, [id], (err, details) => {
            if (err) return res.status(500).json({ error: err.message });

            // Get social links
            db.get("SELECT * FROM social_links WHERE user_id = ?", [id], (err, social) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ ...row, ...details, socialLinks: social });
            });
        });
    });
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, bio, avatar_url, cover_url } = req.body;

    const sql = `UPDATE users SET first_name = ?, last_name = ?, bio = ?, avatar_url = ?, cover_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    db.run(sql, [first_name, last_name, bio, avatar_url, cover_url, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User updated successfully" });
    });
});

app.put('/api/users/:id/details', (req, res) => {
    const { id } = req.params;
    const { role, details, social } = req.body; // details depends on role

    // Update Social Links
    if (social) {
        db.get("SELECT user_id FROM social_links WHERE user_id = ?", [id], (err, row) => {
            if (row) {
                db.run("UPDATE social_links SET linkedin = ?, github = ?, website = ? WHERE user_id = ?",
                    [social.linkedin, social.github, social.website, id]);
            } else {
                db.run("INSERT INTO social_links (user_id, linkedin, github, website) VALUES (?, ?, ?, ?)",
                    [id, social.linkedin, social.github, social.website]);
            }
        });
    }

    // Update Role Specific Details
    let table = 'students';
    let query = '';
    let params = [];

    if (role === 'student') {
        table = 'students';
        query = "UPDATE students SET major = ?, level = ?, academic_year = ?, skills = ?, interests = ? WHERE user_id = ?";
        params = [details.major, details.level, details.academicYear, JSON.stringify(details.skills), JSON.stringify(details.interests), id];
    } else if (role === 'teacher') {
        table = 'teachers';
        query = "UPDATE teachers SET department = ?, office_location = ?, office_hours = ? WHERE user_id = ?";
        params = [details.department, details.officeLocation, details.officeHours, id];
    }

    if (query) {
        db.run(query, params, function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Details updated successfully" });
        });
    } else {
        res.json({ message: "Social links updated" });
    }
});

// Posts (Feed)
app.get('/api/posts', (req, res) => {
    const viewerId = req.query.viewerId;

    // Complex query to get post, author, counts, and like status
    const sql = `
        SELECT 
            p.*,
            u.first_name, u.last_name, u.avatar_url, u.role,
            (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post') as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
            EXISTS (SELECT 1 FROM likes WHERE target_id = p.id AND target_type = 'post' AND user_id = ?) as is_liked
        FROM posts p
        JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
    `;

    db.all(sql, [viewerId || ''], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        // Format for frontend
        const posts = rows.map(post => ({
            id: post.id,
            content: post.content,
            type: post.type,
            imageUrl: post.image_url,
            createdAt: post.created_at ? post.created_at.replace(' ', 'T') + 'Z' : new Date().toISOString(),
            likesCount: post.likes_count,
            commentsCount: post.comments_count,
            isLiked: Boolean(post.is_liked),
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

// Toggle Like
app.post('/api/posts/:id/like', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    db.get("SELECT * FROM likes WHERE user_id = ? AND target_id = ? AND target_type = 'post'", [userId, id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            // Unlike
            db.run("DELETE FROM likes WHERE user_id = ? AND target_id = ? AND target_type = 'post'", [userId, id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ liked: false });
            });
        } else {
            // Like
            db.run("INSERT INTO likes (user_id, target_id, target_type) VALUES (?, ?, 'post')", [userId, id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ liked: true });
            });
        }
    });
});

app.post('/api/comments/:id/like', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    db.get("SELECT * FROM likes WHERE user_id = ? AND target_id = ? AND target_type = 'comment'", [userId, id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            db.run("DELETE FROM likes WHERE user_id = ? AND target_id = ? AND target_type = 'comment'", [userId, id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ liked: false });
            });
        } else {
            db.run("INSERT INTO likes (user_id, target_id, target_type) VALUES (?, ?, 'comment')", [userId, id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ liked: true });
            });
        }
    });
});

// Add Comment
app.post('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const { userId, content, parentCommentId } = req.body;
    const commentId = Math.random().toString(36).substr(2, 9);

    db.run("INSERT INTO comments (id, post_id, author_id, content, parent_comment_id) VALUES (?, ?, ?, ?, ?)", [commentId, id, userId, content, parentCommentId || null], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Return the full comment object for optimisitc UI updates
        db.get(`
            SELECT c.*, u.first_name, u.last_name, u.avatar_url, u.role
            FROM comments c
            JOIN users u ON c.author_id = u.id
            WHERE c.id = ?
        `, [commentId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                id: row.id,
                postId: row.post_id,
                content: row.content,
                createdAt: row.created_at ? row.created_at.replace(' ', 'T') + 'Z' : new Date().toISOString(),
                parentCommentId: row.parent_comment_id,
                likesCount: 0,
                isLiked: false,
                author: {
                    id: row.author_id,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    avatarUrl: row.avatar_url,
                    role: row.role
                }
            });
        });
    });
});

// Get Comments
app.get('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const viewerId = req.query.viewerId;

    const sql = `
        SELECT 
            c.*, 
            u.first_name, u.last_name, u.avatar_url, u.role,
            (SELECT COUNT(*) FROM likes WHERE target_id = c.id AND target_type = 'comment') as likes_count,
            EXISTS (SELECT 1 FROM likes WHERE target_id = c.id AND target_type = 'comment' AND user_id = ?) as is_liked
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
    `;
    db.all(sql, [viewerId || '', id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const comments = rows.map(row => ({
            id: row.id,
            postId: row.post_id,
            content: row.content,
            createdAt: row.created_at ? row.created_at.replace(' ', 'T') + 'Z' : new Date().toISOString(),
            parentCommentId: row.parent_comment_id,
            likesCount: row.likes_count,
            isLiked: Boolean(row.is_liked),
            author: {
                id: row.author_id,
                firstName: row.first_name,
                lastName: row.last_name,
                avatarUrl: row.avatar_url,
                role: row.role
            }
        }));
        res.json({ comments });
    });
});

// Create Post
app.post('/api/posts', (req, res) => {
    const { authorId, content, type, groupId, clubId } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();

    const sql = `INSERT INTO posts (id, author_id, content, type, group_id, club_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, authorId, content, type, groupId, clubId, createdAt], function (err) {
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

app.get('/api/groups/:id', (req, res) => {
    const { id } = req.params;
    const viewerId = req.query.viewerId;

    const sql = `
        SELECT 
            g.*,
            EXISTS (SELECT 1 FROM group_members WHERE group_id = g.id AND user_id = ?) as is_member
        FROM groups g
        WHERE g.id = ?
    `;

    db.get(sql, [viewerId || '', id], (err, group) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!group) return res.status(404).json({ error: "Group not found" });

        const isMember = Boolean(group.is_member);
        const isPrivate = group.visibility === 'private';

        // If group is private and user is not a member, return limited info
        if (isPrivate && !isMember) {
            db.get("SELECT id, first_name, last_name, avatar_url FROM users WHERE id = ?", [group.created_by], (err, creator) => {
                // Get member count
                db.get("SELECT COUNT(*) as count FROM group_members WHERE group_id = ?", [id], (err, countResult) => {
                    const memberCount = countResult ? countResult.count : 0;

                    // Check if user has a pending join request
                    db.get(
                        "SELECT status FROM group_join_requests WHERE group_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1",
                        [id, viewerId || ''],
                        (err, joinRequest) => {
                            res.json({
                                id: group.id,
                                name: group.name,
                                description: group.description,
                                type: group.type,
                                visibility: group.visibility,
                                coverUrl: group.cover_url,
                                createdAt: group.created_at,
                                isMember: false,
                                membersCount: memberCount,
                                createdBy: creator ? {
                                    id: creator.id,
                                    firstName: creator.first_name,
                                    lastName: creator.last_name,
                                    avatarUrl: creator.avatar_url
                                } : { id: 'unknown', firstName: 'Unknown', lastName: '' },
                                // Limited info - no members list, posts, or messages
                                members: [],
                                posts: [],
                                rules: [],
                                // Include join request status if exists
                                joinRequestStatus: joinRequest ? joinRequest.status : null
                            });
                        }
                    );
                });
            });
            return; // Early exit for private groups
        }

        // Full access for public groups or members of private groups
        // Get members
        db.all(`
            SELECT u.id, u.first_name, u.last_name, u.avatar_url, gm.role, gm.joined_at
            FROM group_members gm
            JOIN users u ON gm.user_id = u.id
            WHERE gm.group_id = ?
            ORDER BY gm.role DESC, gm.joined_at ASC
        `, [id], (err, members) => {
            if (err) return res.status(500).json({ error: err.message });

            // Get posts for this group
            db.all(`
               SELECT 
                    p.*,
                    u.first_name, u.last_name, u.avatar_url, u.role as author_role,
                    (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post') as likes_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
                    EXISTS (SELECT 1 FROM likes WHERE target_id = p.id AND target_type = 'post' AND user_id = ?) as is_liked
                FROM posts p
                JOIN users u ON p.author_id = u.id
                WHERE p.group_id = ?
                ORDER BY p.created_at DESC
            `, [viewerId || '', id], (err, posts) => {
                if (err) return res.status(500).json({ error: err.message });

                // Format posts to match frontend type
                const formattedPosts = posts.map(post => ({
                    id: post.id,
                    content: post.content,
                    type: post.type,
                    imageUrl: post.image_url,
                    createdAt: post.created_at ? post.created_at.replace(' ', 'T') + 'Z' : new Date().toISOString(),
                    likesCount: post.likes_count,
                    commentsCount: post.comments_count,
                    isLiked: Boolean(post.is_liked),
                    sharesCount: 0,
                    author: {
                        id: post.author_id,
                        firstName: post.first_name,
                        lastName: post.last_name,
                        role: post.author_role,
                        avatarUrl: post.avatar_url
                    }
                }));

                // Format members to match frontend type
                const formattedMembers = members.map(m => ({
                    user: {
                        id: m.id,
                        firstName: m.first_name,
                        lastName: m.last_name,
                        avatarUrl: m.avatar_url
                    },
                    role: m.role,
                    joinedAt: m.joined_at
                }));

                // Get creator
                db.get("SELECT id, first_name, last_name, avatar_url FROM users WHERE id = ?", [group.created_by], (err, creator) => {
                    // Even if err or no creator, proceed

                    res.json({
                        ...group,
                        isMember,
                        coverUrl: group.cover_url,
                        createdAt: group.created_at,
                        membersCount: members.length,
                        createdBy: creator ? {
                            id: creator.id,
                            firstName: creator.first_name,
                            lastName: creator.last_name,
                            avatarUrl: creator.avatar_url
                        } : { id: 'unknown', firstName: 'Unknown', lastName: '' },
                        academicYear: group.academic_year,
                        parentClubId: group.parent_club_id,

                        // We need parent club name if it exists
                        // This is getting nested, maybe do a separate query or join?
                        // For now, let's just return what we have.
                        members: formattedMembers,
                        posts: formattedPosts,
                        rules: [], // Schema doesn't have rules column yet, return empty or mock?
                        joinRequestStatus: null // No join request needed for public groups or existing members
                    });
                });
            });
        });
    });
});

// Group Join Requests
app.post('/api/groups/:id/request-join', (req, res) => {
    const { id } = req.params;
    const { userId, message } = req.body;

    // Check if group exists and is private
    db.get("SELECT visibility FROM groups WHERE id = ?", [id], (err, group) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!group) return res.status(404).json({ error: "Group not found" });

        // Check if already a member
        db.get("SELECT * FROM group_members WHERE group_id = ? AND user_id = ?", [id, userId], (err, member) => {
            if (member) return res.status(400).json({ error: "Already a member" });

            // Insert or update join request
            db.run(`
                INSERT INTO group_join_requests (group_id, user_id, message, status)
                VALUES (?, ?, ?, 'pending')
                ON CONFLICT(group_id, user_id) 
                DO UPDATE SET status = 'pending', created_at = CURRENT_TIMESTAMP, message = ?
            `, [id, userId, message || '', message || ''], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Join request sent", requestId: this.lastID || id });
            });
        });
    });
});

// Get join requests for a group (admin/moderator only)
app.get('/api/groups/:id/join-requests', (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    // Check if user is admin or moderator
    db.get("SELECT role FROM group_members WHERE group_id = ? AND user_id = ?", [id, userId], (err, member) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!member || (member.role !== 'admin' && member.role !== 'moderator')) {
            return res.status(403).json({ error: "Not authorized" });
        }

        // Get pending requests
        db.all(`
            SELECT jr.*, u.first_name, u.last_name, u.avatar_url, u.role as user_role
            FROM group_join_requests jr
            JOIN users u ON jr.user_id = u.id
            WHERE jr.group_id = ? AND jr.status = 'pending'
            ORDER BY jr.created_at DESC
        `, [id], (err, requests) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const formattedRequests = requests.map(r => ({
                id: r.id,
                groupId: r.group_id,
                user: {
                    id: r.user_id,
                    firstName: r.first_name,
                    lastName: r.last_name,
                    avatarUrl: r.avatar_url,
                    role: r.user_role
                },
                message: r.message,
                status: r.status,
                createdAt: r.created_at
            }));

            res.json({ requests: formattedRequests });
        });
    });
});

// Approve join request
app.post('/api/groups/join-requests/:requestId/approve', (req, res) => {
    const { requestId } = req.params;
    const { reviewerId } = req.body;

    // Get the join request
    db.get("SELECT * FROM group_join_requests WHERE id = ?", [requestId], (err, request) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!request) return res.status(404).json({ error: "Join request not found" });

        // Check if reviewer is admin or moderator
        db.get("SELECT role FROM group_members WHERE group_id = ? AND user_id = ?", [request.group_id, reviewerId], (err, member) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!member || (member.role !== 'admin' && member.role !== 'moderator')) {
                return res.status(403).json({ error: "Not authorized" });
            }

            // Add user to group
            db.run("INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, 'member')", 
                [request.group_id, request.user_id], 
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Update request status
                    db.run(`
                        UPDATE group_join_requests 
                        SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                    `, [reviewerId, requestId], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Join request approved" });
                    });
                }
            );
        });
    });
});

// Reject join request
app.post('/api/groups/join-requests/:requestId/reject', (req, res) => {
    const { requestId } = req.params;
    const { reviewerId } = req.body;

    // Get the join request
    db.get("SELECT * FROM group_join_requests WHERE id = ?", [requestId], (err, request) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!request) return res.status(404).json({ error: "Join request not found" });

        // Check if reviewer is admin or moderator
        db.get("SELECT role FROM group_members WHERE group_id = ? AND user_id = ?", [request.group_id, reviewerId], (err, member) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!member || (member.role !== 'admin' && member.role !== 'moderator')) {
                return res.status(403).json({ error: "Not authorized" });
            }

            // Update request status
            db.run(`
                UPDATE group_join_requests 
                SET status = 'rejected', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [reviewerId, requestId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Join request rejected" });
            });
        });
    });
});

app.get('/api/clubs', (req, res) => {
    const viewerId = req.query.viewerId;
    const sql = `
        SELECT 
            c.*,
            (SELECT COUNT(*) FROM club_members WHERE club_id = c.id) as members_count,
            (SELECT COUNT(*) FROM events WHERE club_id = c.id) as events_count,
            EXISTS (SELECT 1 FROM club_members WHERE club_id = c.id AND user_id = ?) as is_member
        FROM clubs c
        ORDER BY c.name ASC
    `;
    db.all(sql, [viewerId || ''], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const clubs = rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            category: row.category,
            logoUrl: row.logo_url,
            coverUrl: row.cover_url,
            contactEmail: row.contact_email,
            website: row.website,
            createdAt: row.created_at,
            isMember: Boolean(row.is_member),
            membersCount: row.members_count,
            eventsCount: row.events_count,
            members: [], // Prevent crash on .length
            events: []  // Prevent crash on .length
        }));
        res.json({ clubs });
    });
});

app.get('/api/clubs/:id', (req, res) => {
    const { id } = req.params;
    const viewerId = req.query.viewerId;

    const sql = `
        SELECT 
            c.*,
            (SELECT COUNT(*) FROM club_members WHERE club_id = c.id) as members_count,
            EXISTS (SELECT 1 FROM club_members WHERE club_id = c.id AND user_id = ?) as is_member
        FROM clubs c
        WHERE c.id = ?
    `;

    db.get(sql, [viewerId || '', id], (err, club) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!club) return res.status(404).json({ error: "Club not found" });

        // Get members
        db.all(`
            SELECT u.id, u.first_name, u.last_name, u.avatar_url, cm.role, cm.joined_at
            FROM club_members cm
            JOIN users u ON cm.user_id = u.id
            WHERE cm.club_id = ?
            ORDER BY cm.role DESC, cm.joined_at ASC
        `, [id], (err, members) => {
            if (err) return res.status(500).json({ error: err.message });

            // Get events
            db.all(`SELECT * FROM events WHERE club_id = ? ORDER BY start_time DESC`, [id], (err, events) => {
                if (err) return res.status(500).json({ error: err.message });

                // Get posts (Club Feed)
                db.all(`
                    SELECT 
                        p.*,
                        u.first_name, u.last_name, u.avatar_url, u.role as author_role,
                        (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post') as likes_count,
                        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
                        EXISTS (SELECT 1 FROM likes WHERE target_id = p.id AND target_type = 'post' AND user_id = ?) as is_liked
                    FROM posts p
                    JOIN users u ON p.author_id = u.id
                    WHERE p.club_id = ?
                    ORDER BY p.created_at DESC
                `, [viewerId || '', id], (err, posts) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Map to camelCase
                    const formattedClub = {
                        id: club.id,
                        name: club.name,
                        description: club.description,
                        category: club.category,
                        logoUrl: club.logo_url,
                        coverUrl: club.cover_url,
                        contactEmail: club.contact_email,
                        website: club.website,
                        createdAt: club.created_at,
                        isMember: Boolean(club.is_member),
                        membersCount: club.members_count,
                        // Rules can be parsed if stored as JSON or split by newline if text
                        rules: club.rules ? JSON.parse(club.rules) : []
                    };

                    const formattedMembers = members.map(m => ({
                        user: {
                            id: m.id,
                            firstName: m.first_name,
                            lastName: m.last_name,
                            avatarUrl: m.avatar_url,
                            role: 'student', // default, join query could be better
                            // Add other user fields if needed by MemberCard
                            major: 'Unknown', // Placeholder
                            department: 'Unknown'
                        },
                        role: m.role,
                        joinedAt: m.joined_at
                    }));

                    const formattedEvents = events.map(e => ({
                        id: e.id,
                        clubId: e.club_id,
                        title: e.title,
                        description: e.description,
                        date: e.start_time,
                        location: e.location,
                        coverUrl: e.cover_url,
                        status: e.status,
                        isOnline: e.location && (e.location.toLowerCase().includes('zoom') || e.location.toLowerCase().includes('discord') || e.location.toLowerCase().includes('enligne'))
                    }));

                    const formattedPosts = posts.map(post => ({
                        id: post.id,
                        content: post.content,
                        type: post.type,
                        imageUrl: post.image_url,
                        createdAt: post.created_at,
                        likesCount: post.likes_count,
                        commentsCount: post.comments_count,
                        isLiked: Boolean(post.is_liked),
                        sharesCount: 0,
                        author: {
                            id: post.author_id,
                            firstName: post.first_name,
                            lastName: post.last_name,
                            role: post.author_role,
                            avatarUrl: post.avatar_url
                        }
                    }));

                    res.json({
                        ...formattedClub,
                        members: formattedMembers,
                        events: formattedEvents,
                        posts: formattedPosts
                    });
                });
            });
        });
    });
});

app.post('/api/clubs/:id/join', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    db.run("INSERT INTO club_members (club_id, user_id, role) VALUES (?, ?, 'member')", [id, userId], function (err) {
        if (err) {
            // Ignore duplicate error usually
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.json({ message: "Already a member" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Joined club successfully" });
    });
});

app.post('/api/clubs/:id/leave', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    db.run("DELETE FROM club_members WHERE club_id = ? AND user_id = ?", [id, userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Left club successfully" });
    });
});

// Events
app.get('/api/events', (req, res) => {
    const viewerId = req.query.viewerId;
    const sql = `
        SELECT 
            e.*,
            c.name as club_name, c.logo_url as club_logo,
            (SELECT COUNT(*) FROM event_attendees WHERE event_id = e.id) as attendees_count,
             EXISTS (SELECT 1 FROM event_attendees WHERE event_id = e.id AND user_id = ?) as is_attending
        FROM events e
        JOIN clubs c ON e.club_id = c.id
        WHERE e.status != 'cancelled'
        ORDER BY e.start_time ASC
    `;

    db.all(sql, [viewerId || ''], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const events = rows.map(row => ({
            id: row.id,
            clubId: row.club_id,
            title: row.title,
            description: row.description,
            date: row.start_time ? row.start_time.replace(' ', 'T') + 'Z' : new Date().toISOString(), // Map start_time to date
            location: row.location,
            coverUrl: row.cover_url,
            status: row.status,
            clubName: row.club_name,
            clubLogo: row.club_logo,
            isAttending: Boolean(row.is_attending),
            attendeesCount: row.attendees_count,
            attendees: [], // Prevent crash on list view
            guests: [],
            isOnline: row.location && (row.location.toLowerCase().includes('zoom') || row.location.toLowerCase().includes('discord') || row.location.toLowerCase().includes('enligne'))
        }));
        res.json({ events });
    });
});


app.get('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const viewerId = req.query.viewerId;

    const sqlEvent = `
        SELECT e.*, c.name as club_name, c.logo_url as club_logo, c.category as club_category, c.cover_url as club_cover, c.description as club_desc
        FROM events e
        JOIN clubs c ON e.club_id = c.id
        WHERE e.id = ?
    `;

    db.get(sqlEvent, [id], (err, event) => {
        if (err) {
             console.error('Database error fetching event:', err);
             return res.status(500).json({ error: err.message });
        }
        if (!event) {
            console.log(`Event with id ${id} not found in database or JOIN failed`);
            // Debug: check if event exists without join
             db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
                 if (row) console.log('Event exists but JOIN failed. Event data:', row);
                 if (!row) console.log('Event literally does not exist in events table');
             });
            return res.status(404).json({ error: "Event not found" });
        }

        // Get attendees
        const sqlAttendees = `
            SELECT u.id, u.first_name, u.last_name, u.avatar_url, u.role
            FROM event_attendees ea
            JOIN users u ON ea.user_id = u.id
            WHERE ea.event_id = ?
        `;

        db.all(sqlAttendees, [id], (err, attendees) => {
            if (err) return res.status(500).json({ error: err.message });

            const formattedAttendees = attendees.map(u => ({
                id: u.id,
                firstName: u.first_name,
                lastName: u.last_name,
                avatarUrl: u.avatar_url,
                role: u.role
            }));

            // Format Event
            const formattedEvent = {
                id: event.id,
                clubId: event.club_id,
                title: event.title,
                description: event.description,
                fullDescription: event.full_description,
                date: event.start_time ? event.start_time.replace(' ', 'T') + 'Z' : new Date().toISOString(),
                endDate: event.end_time ? event.end_time.replace(' ', 'T') + 'Z' : undefined,
                location: event.location,
                isOnline: Boolean(event.is_online),
                meetingUrl: event.meeting_url,
                isPaid: Boolean(event.is_paid),
                price: event.price,
                coverUrl: event.cover_url || event.club_cover,
                status: event.status,

                // Relations
                club: {
                    id: event.club_id,
                    name: event.club_name,
                    category: event.club_category,
                    logoUrl: event.club_logo,
                    coverUrl: event.club_cover,
                    description: event.club_desc
                },
                attendees: formattedAttendees,
                attendeesCount: formattedAttendees.length,
                isAttending: formattedAttendees.some(a => String(a.id) === String(viewerId)),
                guests: [] // Placeholder as there is no guests table yet, simplified
            };

            res.json(formattedEvent);
        });
    });
});


app.post('/api/events/:id/join', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    db.run("INSERT INTO event_attendees (event_id, user_id, status) VALUES (?, ?, 'confirmed')", [id, userId], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.json({ message: "Already attending" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Joined event successfully" });
    });
});

app.post('/api/events/:id/leave', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    db.run("DELETE FROM event_attendees WHERE event_id = ? AND user_id = ?", [id, userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Left event successfully" });
    });
});

// Follow System
app.post('/api/users/:id/follow', (req, res) => {
    const { id } = req.params; // User to follow
    const { userId } = req.body; // Current user

    if (id === userId) return res.status(400).json({ error: "Cannot follow yourself" });

    db.run("INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)", [userId, id], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.json({ message: "Already following" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Followed successfully" });
    });
});

app.post('/api/users/:id/unfollow', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    db.run("DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?", [userId, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Unfollowed successfully" });
    });
});

app.get('/api/users/:id/followers', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT u.id, u.first_name, u.last_name, u.avatar_url, u.role
        FROM user_follows uf
        JOIN users u ON uf.follower_id = u.id
        WHERE uf.following_id = ?
    `;
    db.all(sql, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ followers: rows });
    });
});

app.get('/api/users/:id/following', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT u.id, u.first_name, u.last_name, u.avatar_url, u.role
        FROM user_follows uf
        JOIN users u ON uf.following_id = u.id
        WHERE uf.follower_id = ?
    `;
    db.all(sql, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ following: rows });
    });
});

app.get('/api/users/:id/stats', (req, res) => {
    const { id } = req.params;
    const sql1 = "SELECT COUNT(*) as count FROM user_follows WHERE following_id = ?";
    const sql2 = "SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ?";

    db.get(sql1, [id], (err, followers) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get(sql2, [id], (err, following) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                followersCount: followers.count,
                followingCount: following.count
            });
        });
    });
});

// Reports
app.post('/api/reports', (req, res) => {
    const { reporterId, targetId, targetType, reason } = req.body;
    const id = Math.random().toString(36).substr(2, 9);

    db.run("INSERT INTO reports (id, reporter_id, target_id, target_type, reason) VALUES (?, ?, ?, ?, ?)",
        [id, reporterId, targetId, targetType, reason],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Report submitted successfully", id });
        }
    );
});

app.get('/api/reports', (req, res) => {
    // Should be admin protected in real app
    db.all("SELECT * FROM reports ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ reports: rows });
    });
});

app.put('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.run("UPDATE reports SET status = ? WHERE id = ?", [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Report status updated" });
    });
});

// Visitor Management
app.post('/api/visitors', (req, res) => {
    const { email, firstName, lastName, phone } = req.body;
    const id = Math.random().toString(36).substr(2, 9);

    db.run("INSERT INTO visitors (id, email, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)",
        [id, email, firstName, lastName, phone],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    // If visitor exists, try to get their ID by email
                    return db.get("SELECT id FROM visitors WHERE email = ?", [email], (err, row) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Visitor already exists", id: row.id });
                    });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Visitor registered", id });
        }
    );
});

app.post('/api/events/:id/visitors', (req, res) => {
    const { id } = req.params;
    const { visitorId } = req.body;

    db.run("INSERT INTO event_visitor_attendance (event_id, visitor_id) VALUES (?, ?)",
        [id, visitorId],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.json({ message: "Visitor already registered for this event" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Visitor registered for event" });
        }
    );
});

app.get('/api/events/:id/visitors', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT v.*, eva.joined_at
        FROM visitors v
        JOIN event_visitor_attendance eva ON v.id = eva.visitor_id
        WHERE eva.event_id = ?
    `;
    db.all(sql, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ visitors: rows });
    });
});

// ---------------------------------------------
// Group Messages API
// ---------------------------------------------

app.get('/api/groups/:id/messages', (req, res) => {
    const { id } = req.params;
    // Find the default discussion for this group
    db.get("SELECT id FROM discussions WHERE group_id = ?", [id], (err, discussion) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!discussion) return res.status(404).json({ error: "No discussion found for this group" });

        const sql = `
            SELECT m.*, 
                   u.id as author_id, u.first_name, u.last_name, u.avatar_url, u.role as author_role
            FROM messages m
            JOIN users u ON m.author_id = u.id
            WHERE m.discussion_id = ?
            ORDER BY m.created_at ASC
        `;

        db.all(sql, [discussion.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            const messages = rows.map(row => ({
                id: row.id,
                discussionId: row.discussion_id,
                content: row.content,
                createdAt: row.created_at,
                author: {
                    id: row.author_id,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    avatarUrl: row.avatar_url,
                    role: row.author_role
                }
            }));

            res.json({ messages });
        });
    });
});

app.post('/api/groups/:id/messages', (req, res) => {
    const { id } = req.params; // group id
    const { content, userId } = req.body;

    // Find discussion first
    db.get("SELECT id FROM discussions WHERE group_id = ?", [id], (err, discussion) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!discussion) return res.status(404).json({ error: "No discussion found" });

        const sql = `INSERT INTO messages (discussion_id, author_id, content) VALUES (?, ?, ?)`;
        db.run(sql, [discussion.id, userId, content], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Return the created message structure with author details
            db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
                res.json({
                    id: this.lastID,
                    discussionId: discussion.id,
                    content,
                    createdAt: new Date().toISOString(),
                    author: {
                        id: user.id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        avatarUrl: user.avatar_url,
                        role: user.role
                    }
                });
            });
        });
    });
});

// Generic Discussions API
app.get('/api/discussions', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    // Get all discussions the user is part of
    const sql = `
        SELECT d.*, m.content as last_content, m.created_at as last_at, m.author_id as last_author_id
        FROM discussions d
        JOIN discussion_participants dp ON d.id = dp.discussion_id
        LEFT JOIN (
            SELECT discussion_id, content, created_at, author_id,
                   ROW_NUMBER() OVER (PARTITION BY discussion_id ORDER BY created_at DESC) as rn
            FROM messages
        ) m ON d.id = m.discussion_id AND m.rn = 1
        WHERE dp.user_id = ?
        ORDER BY COALESCE(m.created_at, d.created_at) DESC
    `;

    db.all(sql, [userId], (err, discussions) => {
        if (err) return res.status(500).json({ error: err.message });

        // For each discussion, get participants
        const fetchParticipants = discussions.map(disc => {
            return new Promise((resolve, reject) => {
                const pSql = `
                    SELECT u.id, u.first_name, u.last_name, u.avatar_url, u.role
                    FROM discussion_participants dp
                    JOIN users u ON dp.user_id = u.id
                    WHERE dp.discussion_id = ?
                `;
                db.all(pSql, [disc.id], (err, participants) => {
                    if (err) reject(err);
                    else {
                        resolve({
                            id: disc.id,
                            groupId: disc.group_id,
                            title: disc.title,
                            createdAt: disc.created_at,
                            participants: participants.map(p => ({
                                id: p.id,
                                firstName: p.first_name,
                                lastName: p.last_name,
                                avatarUrl: p.avatar_url,
                                role: p.role
                            })),
                            lastMessage: disc.last_author_id ? {
                                content: disc.last_content,
                                createdAt: disc.last_at,
                                authorId: disc.last_author_id
                            } : null,
                            unreadCount: 0, // Simplified for now
                            updatedAt: disc.last_at || disc.created_at
                        });
                    }
                });
            });
        });

        Promise.all(fetchParticipants)
            .then(results => res.json({ conversations: results }))
            .catch(err => res.status(500).json({ error: err.message }));
    });
});

app.get('/api/discussions/:id/messages', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT m.*, 
               u.id as author_id, u.first_name, u.last_name, u.avatar_url, u.role as author_role
        FROM messages m
        JOIN users u ON m.author_id = u.id
        WHERE m.discussion_id = ?
        ORDER BY m.created_at ASC
    `;

    db.all(sql, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const messages = rows.map(row => ({
            id: row.id,
            discussionId: row.discussion_id,
            content: row.content,
            createdAt: row.created_at,
            author: {
                id: row.author_id,
                firstName: row.first_name,
                lastName: row.last_name,
                avatarUrl: row.avatar_url,
                role: row.author_role
            }
        }));

        res.json({ messages });
    });
});

app.post('/api/discussions/:id/messages', (req, res) => {
    const { id } = req.params;
    const { content, userId } = req.body;

    const sql = `INSERT INTO messages (discussion_id, author_id, content) VALUES (?, ?, ?)`;
    db.run(sql, [id, userId, content], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const messageId = this.lastID;
        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
            res.json({
                id: messageId,
                discussionId: id,
                content,
                createdAt: new Date().toISOString(),
                author: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatarUrl: user.avatar_url,
                    role: user.role
                }
            });
        });
    });
});

app.post('/api/discussions', (req, res) => {
    const { participants, title, createdBy, groupId } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();

    db.serialize(() => {
        db.run("INSERT INTO discussions (id, group_id, title, created_by, created_at) VALUES (?, ?, ?, ?, ?)",
            [id, groupId || null, title || null, createdBy, createdAt],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                const insertParticipant = db.prepare("INSERT INTO discussion_participants (discussion_id, user_id) VALUES (?, ?)");
                participants.forEach(pId => {
                    insertParticipant.run(id, pId);
                });
                insertParticipant.finalize();

                res.json({ id, title, createdAt });
            }
        );
    });
});

// Group Join/Leave
app.post('/api/groups/:id/join', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    db.run("INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, 'member')", [id, userId], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.json({ message: "Already a member" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Joined group successfully" });
    });
});

app.post('/api/groups/:id/leave', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    db.run("DELETE FROM group_members WHERE group_id = ? AND user_id = ?", [id, userId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Left group successfully" });
    });
});


// Auth Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Simple query to find user by email
    // Per user request: Password check is skipped/lax for now
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });

        // In a real app, verify password here:
        // const valid = await bcrypt.compare(password, user.password_hash);
        // if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

        // Return user info and a fake token
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                avatarUrl: user.avatar_url,
                bio: user.bio
            },
            token: 'mock-jwt-token-' + Date.now()
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Hack to keep the process alive if it's exiting prematurely
setInterval(() => {}, 10000);
