const express = require('express');
const complaintsController = require('./complaints.controller');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/', requireAuth, complaintsController.submitComplaint);
router.get('/mine', requireAuth, complaintsController.getMyComplaints);
router.get('/all', requireAuth, requireRole(['admin']), complaintsController.getAllComplaints);

module.exports = router;
