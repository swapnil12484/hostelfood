-- HostelFood Database Schema
-- Run this file to manually recreate the database tables if they are deleted.

-- Users Table
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

-- Meal Slots Table
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

-- Attendance Responses Table
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

-- Meal Feedback Table
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

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  source_label VARCHAR(100),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints Table
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

-- Notifications Table
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

-- Insert Default Admin User 
-- (Note: You should replace the password_hash with a freshly generated one if running manually, 
-- or simply use the backend's POST /api/v1/auth/setup-admin endpoint after tables are created)
INSERT IGNORE INTO users (email, password_hash, full_name, role, room_no)
VALUES ('admin@hostelfood.com', '$2b$12$R.3I1I1X2xPz.5651XhY2Ou9yV0Wz5OQ3C9aZ.2S.fL/D5vC8/b7i', 'Admin User', 'admin', NULL);
