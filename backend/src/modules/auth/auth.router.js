const express = require('express');
const authController = require('./auth.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.post('/setup-admin', authController.setupAdmin);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
