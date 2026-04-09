const complaintsService = require('./complaints.service');
const { submitComplaintSchema } = require('./complaints.validation');

const submitComplaint = async (req, res) => {
  try {
    const validatedData = submitComplaintSchema.parse(req.body);
    const complaint = await complaintsService.submitComplaint(
      req.user.userId,
      validatedData.category,
      validatedData.title,
      validatedData.description
    );
    return res.status(201).json({ complaint });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: err.errors });
    }
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await complaintsService.getMyComplaints(req.user.userId);
    return res.json({ complaints });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await complaintsService.getAllComplaints();
    return res.json({ complaints });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await complaintsService.resolveComplaint(id);
    return res.json({ message: 'Complaint resolved successfully' });
  } catch (err) {
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' });
  }
};

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  resolveComplaint
};
