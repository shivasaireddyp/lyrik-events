const express = require('express');
const router = express.Router();
const {
  getAllVenues,
  createVenue,
  updateVenue,
  getVenueAvailability,
} = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/availability')
  .get(protect, authorize('organizer', 'admin'), getVenueAvailability);

router.route('/')
  .get(protect, authorize('admin', 'organizer'), getAllVenues)
  .post(protect, authorize('admin'), createVenue);

router.route('/:id')
  .put(protect, authorize('admin'), updateVenue);

module.exports = router;