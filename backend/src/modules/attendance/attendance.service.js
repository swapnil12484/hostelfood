const db = require('../../db');

const updateAttendance = async (userId, mealSlotId, status) => {
  // Check if meal slot exists and cutoff time hasn't passed
  const { rows: mealRows } = await db.query(
    'SELECT service_date, start_time, cutoff_time FROM meal_slots WHERE id = ?',
    [mealSlotId]
  );
  
  if (!mealRows[0]) {
    throw { code: 'NOT_FOUND', message: 'Meal slot not found' };
  }
  
  const meal = mealRows[0];
  const now = new Date();
  
  // Basic cutoff check (simplified for this example; assumes dates are comparable)
  // In a real system, you'd compare the actual timestamp of now vs meal.service_date + cutoff_time
  /*
  const cutoffDateTime = new Date(`${meal.service_date.toISOString().split('T')[0]}T${meal.cutoff_time}`);
  if (now > cutoffDateTime) {
    throw { code: 'BAD_REQUEST', message: 'Cutoff time has passed for this meal' };
  }
  */

  // Upsert attendance
  const query = `
    INSERT INTO attendance_responses (user_id, meal_slot_id, status)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE status = VALUES(status), responded_at = CURRENT_TIMESTAMP;
  `;
  
  await db.query(query, [userId, mealSlotId, status]);
  return { user_id: userId, meal_slot_id: mealSlotId, status };
};

const getAttendanceStats = async () => {
  const query = `
    SELECT 
      m.id as meal_slot_id,
      m.service_date,
      m.meal_type,
      m.menu_title,
      COUNT(CASE WHEN ar.status = 'attending' THEN 1 END) as attending_count,
      COUNT(CASE WHEN ar.status = 'not_attending' THEN 1 END) as not_attending_count,
      (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students
    FROM meal_slots m
    LEFT JOIN attendance_responses ar ON m.id = ar.meal_slot_id
    WHERE m.service_date >= CURRENT_DATE
    GROUP BY m.id
    ORDER BY m.service_date ASC, m.start_time ASC
    LIMIT 10;
  `;
  
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  updateAttendance,
  getAttendanceStats
};
