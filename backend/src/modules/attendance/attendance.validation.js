const { z } = require('zod');

const updateAttendanceSchema = z.object({
  status: z.enum(['attending', 'not_attending'])
});

module.exports = {
  updateAttendanceSchema
};
