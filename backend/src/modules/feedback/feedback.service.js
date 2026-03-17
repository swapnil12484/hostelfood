const db = require('../../db');

const submitFeedback = async (userId, mealSlotId, rating, comment) => {
  // Ensure the user hasn't already submitted feedback for this meal
  const checkQuery = 'SELECT id FROM meal_feedback WHERE user_id = ? AND meal_slot_id = ?';
  const { rows: existing } = await db.query(checkQuery, [userId, mealSlotId]);
  
  if (existing.length > 0) {
    throw { code: 'CONFLICT', message: 'Feedback already submitted for this meal' };
  }

  // Insert feedback
  const query = `
    INSERT INTO meal_feedback (user_id, meal_slot_id, rating, comment)
    VALUES (?, ?, ?, ?);
  `;
  
  const { header } = await db.query(query, [userId, mealSlotId, rating, comment]);
  return { id: header.insertId, user_id: userId, meal_slot_id: mealSlotId, rating, comment };
};

const getMyFeedback = async (userId) => {
  const query = `
    SELECT f.*, m.service_date, m.meal_type, m.menu_title 
    FROM meal_feedback f
    JOIN meal_slots m ON f.meal_slot_id = m.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC;
  `;
  
  const { rows } = await db.query(query, [userId]);
  return rows;
};

const getAllFeedback = async () => {
  const query = `
    SELECT f.id, f.rating, f.comment, f.created_at, u.full_name as user_name, m.service_date, m.meal_type, m.menu_title
    FROM meal_feedback f
    JOIN users u ON f.user_id = u.id
    JOIN meal_slots m ON f.meal_slot_id = m.id
    ORDER BY f.created_at DESC;
  `;
  
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getAllFeedback
};
