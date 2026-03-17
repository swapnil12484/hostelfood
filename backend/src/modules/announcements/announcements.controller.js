const announcementsService = require('./announcements.service');

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await announcementsService.getAnnouncements();
    return res.json({ announcements });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  getAnnouncements
};
