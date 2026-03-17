console.log('--- STARTING SERVER ---');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./modules/auth/auth.router');
const usersRouter = require('./modules/users/users.router');
const mealsRouter = require('./modules/meals/meals.router');
const attendanceRouter = require('./modules/attendance/attendance.router');
const feedbackRouter = require('./modules/feedback/feedback.router');
const announcementsRouter = require('./modules/announcements/announcements.router');
const complaintsRouter = require('./modules/complaints/complaints.router');
const notificationsRouter = require('./modules/notifications/notifications.router');
const dashboardRouter = require('./modules/dashboard/dashboard.router');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/announcements', announcementsRouter);
app.use('/api/v1/complaints', complaintsRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Something went wrong!' });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server encountered an error:', err);
});

server.on('close', () => {
  console.log('Server explicitly closed.');
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
