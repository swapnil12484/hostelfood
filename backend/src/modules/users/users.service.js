const db = require('../../db');

const getUserById = async (userId) => {
  const { rows } = await db.query(
    'SELECT id, email, full_name, role, room_no, is_active, created_at FROM users WHERE id = ?',
    [userId]
  );
  
  if (!rows[0]) {
    throw { code: 'NOT_FOUND', message: 'User not found' };
  }
  
  return rows[0];
};

module.exports = {
  getUserById
};
