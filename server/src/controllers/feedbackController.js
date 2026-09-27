const Feedback = require('../models/Feedback');

// POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, type, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const feedback = new Feedback({
      userId: req.user?._id || req.user?.id || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      type: type || 'suggestion',
      subject: subject.trim(),
      message: message.trim()
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for helping us improve Fan Hub Plus.',
      feedback
    });
  } catch (err) {
    console.error('Feedback submit error:', err.message);
    res.status(500).json({ success: false, message: 'Server error while submitting feedback' });
  }
};

// GET /api/admin/feedback (Admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};

    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;

    const feedbackList = await Feedback.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      results: feedbackList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};

// PATCH /api/admin/feedback/:id/status (Admin only)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

    res.status(200).json({
      success: true,
      message: `Feedback marked as ${status}`,
      feedback
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
