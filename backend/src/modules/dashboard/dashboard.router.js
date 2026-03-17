const express = require('express');
const dashboardController = require('./dashboard.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/summary', requireAuth, dashboardController.getSummary);

module.exports = router;
