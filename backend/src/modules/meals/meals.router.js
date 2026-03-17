const express = require('express');
const mealsController = require('./meals.controller');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/today', requireAuth, mealsController.getTodayMeals);
router.get('/weekly', requireAuth, mealsController.getWeeklyMeals);
router.post('/', requireAuth, requireRole(['admin']), mealsController.createMeal);

module.exports = router;
