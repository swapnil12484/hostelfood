const db = require('../../db');

const getAnnouncements = async () => {
  const query = `
    SELECT id, title, body, source_label, published_at
    FROM announcements
    WHERE published_at <= CURRENT_TIMESTAMP
    ORDER BY published_at DESC;
  `;
  
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  getAnnouncements
};
