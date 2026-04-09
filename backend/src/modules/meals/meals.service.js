const db = require('../../db');

const getTodayMeals = async (userId) => {
  // Get today's date in YYYY-MM-DD format based on local time or server time
  // For simplicity, we use CURRENT_DATE in PostgreSQL
  
  const query = `
    SELECT 
      m.id, m.service_date, m.meal_type, m.menu_title, m.image_url, 
      m.start_time, m.end_time, m.cutoff_time,
      COALESCE(a.status, 'pending') as user_attendance_status,
      (SELECT COUNT(*) FROM meal_feedback f WHERE f.meal_slot_id = m.id AND f.user_id = ?) > 0 as has_rated
    FROM meal_slots m
    LEFT JOIN attendance_responses a ON m.id = a.meal_slot_id AND a.user_id = ?
    WHERE m.service_date = CURDATE()
    ORDER BY m.start_time ASC;
  `;
  
  const { rows } = await db.query(query, [userId, userId]);
  return rows;
};

const getWeeklyMeals = async () => {
  const query = `
    SELECT 
      id, service_date, meal_type, menu_title, image_url, 
      start_time, end_time, cutoff_time
    FROM meal_slots
    WHERE service_date >= CURDATE() 
      AND service_date < DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    ORDER BY service_date ASC, start_time ASC;
  `;
  
  const { rows } = await db.query(query);
  return rows;
};

const createMeal = async (mealData) => {
  const { service_date, meal_type, menu_title, image_url, start_time, end_time, cutoff_time } = mealData;
  const query = `
    INSERT INTO meal_slots (service_date, meal_type, menu_title, image_url, start_time, end_time, cutoff_time)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  
  const { header } = await db.query(query, [service_date, meal_type, menu_title, image_url, start_time, end_time, cutoff_time]);
  return { id: header.insertId, ...mealData };
};

module.exports = {
  getTodayMeals,
  getWeeklyMeals,
  createMeal
};
