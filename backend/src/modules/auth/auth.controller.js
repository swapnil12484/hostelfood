const authService = require('./auth.service');
const { loginSchema, refreshSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } = require('./auth.validation');

const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    return res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    const status = err.code === 'CONFLICT' ? 409 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData.email, validatedData.password, validatedData.role);
    return res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    const status = err.code === 'UNAUTHORIZED' ? 401 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const refresh = async (req, res) => {
  try {
    const validatedData = refreshSchema.parse(req.body);
    const result = await authService.refresh(validatedData.refreshToken);
    return res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    const status = err.code === 'UNAUTHORIZED' ? 401 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user?.userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const setupAdmin = async (req, res) => {
  try {
    const result = await authService.setupAdmin();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(validatedData.email);
    return res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(validatedData.token, validatedData.password);
    return res.json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    const status = err.code === 'INVALID_TOKEN' ? 400 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  login,
  refresh,
  logout,
  setupAdmin,
  register,
  forgotPassword,
  resetPassword
};
