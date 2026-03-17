const { z } = require('zod');

const submitComplaintSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required')
});

module.exports = {
  submitComplaintSchema
};
