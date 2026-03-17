require('dotenv').config();
const mysql = require('mysql2/promise');

const initDb = async () => {
  let connection;
  try {
    console.log('Connecting to database...');
    
    const dbUrl = new URL(process.env.DATABASE_URL);
    const connConfig = {
      host: dbUrl.hostname,
      port: dbUrl.port || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.substring(1),
    };

    if (process.env.DB_REQUIRE_SSL === 'true') {
      connConfig.ssl = { rejectUnauthorized: false };
    }
    connection = await mysql.createConnection(connConfig);
    
    console.log('Creating tables...');

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        room_no VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Meal Slots Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS meal_slots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_date DATE NOT NULL,
        meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
        menu_title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        cutoff_time TIME NOT NULL
      );
    `);

    // Attendance Responses Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        meal_slot_id INT NOT NULL,
        status ENUM('attending', 'not_attending') NOT NULL,
        responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_meal (user_id, meal_slot_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (meal_slot_id) REFERENCES meal_slots(id) ON DELETE CASCADE
      );
    `);

    // Meal Feedback Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS meal_feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        meal_slot_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_feedback (user_id, meal_slot_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (meal_slot_id) REFERENCES meal_slots(id) ON DELETE CASCADE
      );
    `);

    // Announcements Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        source_label VARCHAR(100),
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Complaints Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Notifications Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ All tables created successfully!');

    // Optional: Create a default admin user
    const bcrypt = require('bcrypt');
    const defaultPassword = await bcrypt.hash('admin123', 12);
    
    await connection.query(`
      INSERT IGNORE INTO users (email, password_hash, full_name, role, room_no)
      VALUES (?, ?, 'Admin User', 'admin', NULL)
    `, ['admin@hostelfood.com', defaultPassword]);
    
    console.log('✅ Default admin user created (email: admin@hostelfood.com, password: admin123)');

  } catch (err) {
    console.error('❌ Error initializing database:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
};

initDb();
