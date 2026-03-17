const db = require('../../db');

const submitComplaint = async (userId, category, title, description) => {
  const query = `
    INSERT INTO complaints (user_id, category, title, description, status)
    VALUES (?, ?, ?, ?, 'pending');
  `;
  
  const { header } = await db.query(query, [userId, category, title, description]);
  return { id: header.insertId, user_id: userId, category, title, description, status: 'pending' };
};

const getMyComplaints = async (userId) => {
  const query = `
    SELECT id, category, title, description, status, created_at
    FROM complaints
    WHERE user_id = ?
    ORDER BY created_at DESC;
  `;
  
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const getAllComplaints = async () => {
  const query = `
    SELECT c.id, c.category, c.title, c.description, c.status, c.created_at, u.full_name as user_name
    FROM complaints c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC;
  `;
  
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints
};
