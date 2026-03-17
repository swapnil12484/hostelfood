const attendanceService = require('./attendance.service');
const { updateAttendanceSchema } = require('./attendance.validation');

const updateAttendance = async (req, res) => {
  try {
    const { mealSlotId } = req.params;
    const validatedData = updateAttendanceSchema.parse(req.body);
    
    const attendance = await attendanceService.updateAttendance(
      req.user.userId, 
      mealSlotId, 
      validatedData.status
    );
    
    return res.json({ attendance });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    const status = err.code === 'NOT_FOUND' ? 404 : err.code === 'BAD_REQUEST' ? 400 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const stats = await attendanceService.getAttendanceStats();
    return res.json({ stats });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  updateAttendance,
  getAttendanceStats
};
