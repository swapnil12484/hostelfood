const { z } = require('zod');

const submitFeedbackSchema = z.object({
  meal_slot_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
});

module.exports = {
  submitFeedbackSchema
};
