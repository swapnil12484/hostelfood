const { z } = require('zod');

const createMealSchema = z.object({
  service_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner']),
  menu_title: z.string().min(1, "Title is required"),
  image_url: z.string().optional().or(z.literal("")),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Format must be HH:MM or HH:MM:SS"),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Format must be HH:MM or HH:MM:SS"),
  cutoff_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Format must be HH:MM or HH:MM:SS")
});

module.exports = {
  createMealSchema
};
