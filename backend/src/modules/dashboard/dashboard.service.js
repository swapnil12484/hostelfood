const db = require('../../db');

const getSummary = async (userId) => {
  // Simplified summary logic for demonstration based on the provided schema.
  // In a real system, you'd calculate monthly attendance based on dates, etc.
  
  // 1. Attendance % (Overall for user)
  const attendanceQuery = `
    SELECT 
      SUM(CASE WHEN status = 'attending' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0) as attendance_percentage
    FROM attendance_responses
    WHERE user_id = ?;
  `;
  const { rows: attRows } = await db.query(attendanceQuery, [userId]);
  const attendancePercentage = attRows[0]?.attendance_percentage 
    ? parseFloat(attRows[0].attendance_percentage).toFixed(1) 
    : 0;

  // 2. Average Rating (Overall for user)
  const ratingQuery = `
    SELECT AVG(rating) as avg_rating
    FROM meal_feedback
    WHERE user_id = ?;
  `;
  const { rows: ratRows } = await db.query(ratingQuery, [userId]);
  const avgRating = ratRows[0]?.avg_rating
    ? parseFloat(ratRows[0].avg_rating).toFixed(1)
    : 0;

  // 3. Pending complaints count
  const complaintsQuery = `
    SELECT COUNT(*) as pending_complaints
    FROM complaints
    WHERE user_id = ? AND status = 'pending';
  `;
  const { rows: compRows } = await db.query(complaintsQuery, [userId]);
  const pendingComplaints = parseInt(compRows[0].pending_complaints || 0, 10);

  return {
    attendancePercentage,
    avgRating,
    pendingComplaints
  };
};

module.exports = {
  getSummary
};
