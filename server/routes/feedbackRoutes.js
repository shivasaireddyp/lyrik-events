const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getFeedbackForEvent,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/:eventId')
  .post(protect, submitFeedback)
  .get(protect, authorize('organizer', 'admin'), getFeedbackForEvent);

module.exports = router;