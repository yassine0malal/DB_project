-- Enable Foreign User Constraints
PRAGMA foreign_keys = ON;
-- 1. Users & Authentication
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'teacher', 'admin')) NOT NULL,
    avatar_url TEXT,
    cover_url TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Student Details
CREATE TABLE students (
    user_id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE NOT NULL,
    -- Numéro étudiant
    major TEXT NOT NULL,
    level TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    skills TEXT,
    -- JSON array of strings
    interests TEXT,
    -- JSON array of strings
    projects TEXT,
    -- JSON array of objects
    internship_status TEXT CHECK(
        internship_status IN (
            'seeking_internship',
            'seeking_alternance',
            'open_to_opportunities',
            'not_looking'
        )
    ),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Teacher Details
CREATE TABLE teachers (
    user_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    subjects TEXT,
    -- JSON array
    office_location TEXT,
    office_hours TEXT,
    status TEXT CHECK(status IN ('permanent', 'vacataire')),
    publications TEXT,
    -- JSON array
    is_mentorship_available BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Admin Details
CREATE TABLE admins (
    user_id TEXT PRIMARY KEY,
    admin_role TEXT NOT NULL,
    department TEXT NOT NULL,
    emergency_contact TEXT,
    availability_hours TEXT,
    responsibilities TEXT,
    -- JSON array
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Social Links (common for all user types)
CREATE TABLE social_links (
    user_id TEXT PRIMARY KEY,
    linkedin TEXT,
    github TEXT,
    website TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- User Relationships (Follow System)
CREATE TABLE user_follows (
    follower_id TEXT NOT NULL,
    following_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 2. Groups
CREATE TABLE groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(
        type IN ('friends', 'apartment', 'class', 'club')
    ) NOT NULL,
    visibility TEXT CHECK(visibility IN ('public', 'private')) DEFAULT 'public',
    cover_url TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- Specific fields for class groups
    academic_year TEXT,
    major TEXT,
    level TEXT,
    -- Specific fields for club subgroups
    parent_club_id TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (parent_club_id) REFERENCES clubs(id) ON DELETE CASCADE
);
CREATE TABLE group_members (
    group_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'moderator', 'member')) DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 3. Clubs
CREATE TABLE clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT,
    cover_url TEXT,
    contact_email TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE club_members (
    club_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'moderator', 'member')) DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (club_id, user_id),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 4. Events
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    club_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    location TEXT NOT NULL,
    is_online BOOLEAN DEFAULT 0,
    meeting_url TEXT,
    is_paid BOOLEAN DEFAULT 0,
    price REAL,
    currency TEXT,
    cover_url TEXT,
    max_attendees INTEGER,
    status TEXT CHECK(
        status IN ('upcoming', 'ongoing', 'past', 'cancelled')
    ) DEFAULT 'upcoming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);
CREATE TABLE event_attendees (
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 5. Content (Feed, Posts, Comments)
CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    type TEXT CHECK(type IN ('text', 'image', 'poll')) NOT NULL,
    -- Context (Poly-association)
    group_id TEXT,
    club_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);
CREATE TABLE polls (
    post_id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    end_date DATETIME,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE TABLE poll_options (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL,
    label TEXT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(post_id) ON DELETE CASCADE
);
CREATE TABLE poll_votes (
    poll_id TEXT NOT NULL,
    option_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (poll_id, user_id),
    FOREIGN KEY (poll_id) REFERENCES polls(post_id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id TEXT,
    -- For nested replies
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
CREATE TABLE likes (
    user_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    -- Post ID or Comment ID
    target_type TEXT CHECK(target_type IN ('post', 'comment')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, target_id, target_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 6. Notifications
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    recipient_id TEXT NOT NULL,
    actor_id TEXT,
    -- User who triggered the notification
    type TEXT NOT NULL,
    -- 'like', 'comment', 'follow', 'group_invite', etc.
    reference_id TEXT,
    -- ID of the related entity (post_id, group_id, etc.)
    reference_type TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_group ON posts(group_id);
CREATE INDEX idx_posts_club ON posts(club_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);