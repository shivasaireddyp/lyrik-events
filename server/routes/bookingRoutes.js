const express = require("express");
const router = express.Router();
const {
  getMyBookings,
  verifyBooking,
  cancelBooking,
  initiateBooking,
  confirmBooking,
  getBookingById,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/my-bookings").get(protect, getMyBookings);
router
  .route("/verify-qr")
  .post(protect, authorize("organizer", "admin"), verifyBooking);
router.route("/initiate").post(protect, initiateBooking);
router.route("/:id/confirm").post(protect, confirmBooking);
router.route("/:id").get(protect, getBookingById);
router.route("/:id/cancel").put(protect, cancelBooking);

module.exports = router;
