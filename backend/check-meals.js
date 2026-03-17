require('dotenv').config();
const db = require('./src/db');

async function seed() {
  try {
    console.log('Clearing old slots...');
    await db.query('DELETE FROM meal_slots');
    
    console.log('Seeding 7 days of meals...');
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        await db.query(`
          INSERT INTO meal_slots (service_date, meal_type, menu_title, start_time, end_time, cutoff_time, image_url)
          VALUES 
          (?, 'Breakfast', 'Morning Harvest Pancakes', '07:30:00', '09:00:00', '07:00:00', 'https://images.unsplash.com/photo-1528207776546-365bb710ee93'),
          (?, 'Lunch', 'Zen Quinoa Bowl', '12:30:00', '14:00:00', '10:00:00', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'),
          (?, 'Dinner', 'Emerald Thai Curry', '19:30:00', '21:00:00', '18:00:00', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd')
        `, [dateStr, dateStr, dateStr, dateStr, dateStr, dateStr]);
    }
    console.log('Seeding complete.');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

seed();
