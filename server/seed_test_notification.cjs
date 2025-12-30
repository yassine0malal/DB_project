const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

const notification = {
    user_id: 1,
    type: 'social',
    title: 'Nouveau message',
    message: 'Yassine vous a envoyé un message.',
    is_read: 0,
    link: '/messages',
    sender_name: 'Yassine',
    sender_avatar: 'https://i.pravatar.cc/150?u=yassine',
    sender_id: 'yassine-123',
    metadata: JSON.stringify({ chatId: 'chat-456' })
};

db.run(`
    INSERT INTO notifications (user_id, type, title, message, is_read, link, sender_name, sender_avatar, sender_id, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`, [
    notification.user_id,
    notification.type,
    notification.title,
    notification.message,
    notification.is_read,
    notification.link,
    notification.sender_name,
    notification.sender_avatar,
    notification.sender_id,
    notification.metadata
], function(err) {
    if (err) {
        console.error('Error seeding notification:', err.message);
    } else {
        console.log('Test notification seeded successfully.');
    }
    db.close();
});
