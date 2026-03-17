const express = require('express');
const announcementsController = require('./announcements.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, announcementsController.getAnnouncements);

module.exports = router;
