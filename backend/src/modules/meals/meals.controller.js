const mealsService = require('./meals.service');

const { createMealSchema } = require('./meals.validation');

const getTodayMeals = async (req, res) => {
  try {
    const meals = await mealsService.getTodayMeals(req.user.userId);
    return res.json({ meals });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const getWeeklyMeals = async (req, res) => {
  try {
    const meals = await mealsService.getWeeklyMeals();
    return res.json({ meals });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const createMeal = async (req, res) => {
  try {
    console.log('Attempting to create meal with body:', req.body);
    const validatedData = createMealSchema.parse(req.body);
    const meal = await mealsService.createMeal(validatedData);
    console.log('Meal created successfully:', meal);
    return res.status(201).json({ meal });
  } catch (err) {
    console.error('Error in createMeal:', err);
    if (err.name === 'ZodError') {
      const errorMessage = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: errorMessage });
    }
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  getTodayMeals,
  getWeeklyMeals,
  createMeal
};
