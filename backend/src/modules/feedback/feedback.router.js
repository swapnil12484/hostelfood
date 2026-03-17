const express = require('express');
const feedbackController = require('./feedback.controller');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/', requireAuth, feedbackController.submitFeedback);
router.get('/mine', requireAuth, feedbackController.getMyFeedback);
router.get('/all', requireAuth, requireRole(['admin']), feedbackController.getAllFeedback);

module.exports = router;
