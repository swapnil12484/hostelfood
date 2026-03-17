const feedbackService = require('./feedback.service');
const { submitFeedbackSchema } = require('./feedback.validation');

const submitFeedback = async (req, res) => {
  try {
    const validatedData = submitFeedbackSchema.parse(req.body);
    const feedback = await feedbackService.submitFeedback(
      req.user.userId,
      validatedData.meal_slot_id,
      validatedData.rating,
      validatedData.comment
    );
    return res.status(201).json({ feedback });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    const status = err.code === 'CONFLICT' ? 409 : 500;
    return res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const feedbackList = await feedbackService.getMyFeedback(req.user.userId);
    return res.json({ feedback: feedbackList });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await feedbackService.getAllFeedback();
    return res.json({ feedback: feedbackList });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getAllFeedback
};
