const express = require('express');
const attendanceController = require('./attendance.controller');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.put('/:mealSlotId', requireAuth, attendanceController.updateAttendance);
router.get('/stats', requireAuth, requireRole(['admin']), attendanceController.getAttendanceStats);

module.exports = router;
