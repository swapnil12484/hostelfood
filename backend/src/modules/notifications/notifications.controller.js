const notificationsService = require('./notifications.service');

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationsService.getNotifications(req.user.userId);
    return res.json({ notifications });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const countData = await notificationsService.getUnreadCount(req.user.userId);
    return res.json(countData);
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const result = await notificationsService.markAsRead(req.user.userId, req.params.id);
    return res.json(result);
  } catch (err) {
    const status = err.code === 'NOT_FOUND' ? 404 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead
};
