const express = require('express');
const notificationsController = require('./notifications.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, notificationsController.getNotifications);
router.get('/unread-count', requireAuth, notificationsController.getUnreadCount);
router.patch('/:id/read', requireAuth, notificationsController.markAsRead);

module.exports = router;
