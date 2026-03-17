const usersService = require('./users.service');

const getMe = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.user.userId);
    return res.json({ user });
  } catch (err) {
    const status = err.code === 'NOT_FOUND' ? 404 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  getMe
};
