const dashboardService = require('./dashboard.service');

const getSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getSummary(req.user.userId);
    return res.json({ summary });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  getSummary
};
