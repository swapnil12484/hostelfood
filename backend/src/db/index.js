const mysql = require('mysql2/promise');

const dbUrl = new URL(process.env.DATABASE_URL);

const poolConfig = {
  host: dbUrl.hostname,
  port: dbUrl.port || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Aiven MySQL Cloud requires SSL
if (process.env.DB_REQUIRE_SSL === 'true') {
  poolConfig.ssl = {
    rejectUnauthorized: false, // You might need false depending on Aiven's cert setup, but true is safer initially
  };
}

const pool = mysql.createPool(poolConfig);

module.exports = {
  query: async (text, params) => {
    const [result] = await pool.query(text, params);
    // mysql2 returns rows directly in the first element of the array for SELECT
    // For INSERT/UPDATE/DELETE it returns an object (ResultSetHeader)
    return { 
      rows: Array.isArray(result) ? result : [],
      header: !Array.isArray(result) ? result : null
    };
  },
  pool
};
