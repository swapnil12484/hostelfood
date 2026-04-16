const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../../db');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

const generateTokens = (user) => {
  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const login = async (email, password, expectedRole = null) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = ? AND is_active = true', [email]);
  const user = rows[0];

  if (!user) {
    throw { code: 'UNAUTHORIZED', message: 'Invalid email or password' };
  }

  if (expectedRole && user.role !== expectedRole) {
    throw { code: 'UNAUTHORIZED', message: `Unauthorized: User is not a ${expectedRole}` };
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw { code: 'UNAUTHORIZED', message: 'Invalid email or password' };
  }

  const tokens = generateTokens(user);
  
  // Omit password_hash before returning user
  const { password_hash, ...userProfile } = user;

  return { ...tokens, user: userProfile };
};

const refresh = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const { rows } = await db.query('SELECT * FROM users WHERE id = ? AND is_active = true', [decoded.userId]);
    const user = rows[0];

    if (!user) {
      throw new Error();
    }

    const tokens = generateTokens(user);
    return tokens;
  } catch (err) {
    throw { code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' };
  }
};

const register = async (userData) => {
  const { fullName, email, password, roomNo } = userData;
  
  // Check if user already exists
  const { rows: existingUsers } = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUsers.length > 0) {
    throw { code: 'CONFLICT', message: 'User with this email already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  await db.query(
    'INSERT INTO users (full_name, email, password_hash, room_no, role) VALUES (?, ?, ?, ?, ?)',
    [fullName, email, hashedPassword, roomNo, 'student']
  );

  return { success: true, message: 'User registered successfully' };
};

const logout = async (userId) => {
  // Since we are not storing refresh tokens in DB (per current minimal requirements),
  // we cannot truly revoke a specific token server-side without a blocklist.
  // For a basic implementation, client deleting token is enough.
  return { success: true };
};

const setupAdmin = async () => {
  const { rows } = await db.query("SELECT * FROM users WHERE role = 'admin'");
  if (rows.length > 0) {
    return { message: 'Admin already exists' };
  }

  const defaultPassword = 'admin' + Math.floor(1000 + Math.random() * 9000); // Randomish default
  const hashed = await bcrypt.hash('admin123', 12);
  
  await db.query(
    "INSERT INTO users (email, password_hash, full_name, role, room_no) VALUES (?, ?, 'Admin User', 'admin', NULL)",
    ['admin@hostelfood.com', hashed]
  );

  return { 
    message: 'Admin created successfully', 
    credentials: { 
      email: 'admin@hostelfood.com', 
      password: 'admin123' 
    } 
  };
};

const forgotPassword = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = ? AND is_active = true', [email]);
  const user = rows[0];

  if (!user) {
    // For security, don't reveal if user exists. Just return success.
    return { success: true, message: 'If an account exists with this email, you will receive a reset link.' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await db.query(
    'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
    [token, expires, user.id]
  );

  // LOGGING RESET LINK (Mocking email sending)
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  console.log('\n--- PASSWORD RESET REQUEST ---');
  console.log(`User: ${email}`);
  console.log(`Reset Link: ${resetLink}`);
  console.log('-----------------------------\n');

  return { success: true, message: 'If an account exists with this email, you will receive a reset link.' };
};

const resetPassword = async (token, newPassword) => {
  const { rows } = await db.query(
    'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW() AND is_active = true',
    [token]
  );
  const user = rows[0];

  if (!user) {
    throw { code: 'INVALID_TOKEN', message: 'Password reset token is invalid or has expired' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await db.query(
    'UPDATE users SET password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
    [hashedPassword, user.id]
  );

  return { success: true, message: 'Password has been reset successfully' };
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
