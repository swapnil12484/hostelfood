const db = require('../../db');

const getNotifications = async (userId) => {
  const query = `
    SELECT id, type, title, body, is_read, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC;
  `;
  
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const getUnreadCount = async (userId) => {
  const query = `
    SELECT COUNT(*) as count
    FROM notifications
    WHERE user_id = ? AND is_read = false;
  `;
  
  const { rows } = await db.query(query, [userId]);
  return { count: parseInt(rows[0].count, 10) };
};

const markAsRead = async (userId, notificationId) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = ? AND user_id = ?;
  `;
  
  const { rows } = await db.query(query, [notificationId, userId]);
  if (rows[0].affectedRows === 0) {
    throw { code: 'NOT_FOUND', message: 'Notification not found' };
  }
  return { id: notificationId, is_read: true };
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead
};
