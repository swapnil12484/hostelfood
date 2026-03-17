const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const pool = mysql.createPool({
      host: dbUrl.hostname,
      port: dbUrl.port || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.substring(1),
    });
    const [rows] = await pool.query('SELECT 1 + 1 as result');
    console.log('Database connection successful:', rows[0].result === 2);
    await pool.end();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
