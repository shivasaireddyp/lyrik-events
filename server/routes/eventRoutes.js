const express = require("express");

const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventAnalytics,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, authorize("organizer", "admin"), createEvent)
  .get(getAllEvents);

router.get("/my-events", protect, authorize("organizer", "admin"), getMyEvents);

router.get(
  "/:id/analytics",
  protect,
  authorize("organizer", "admin"),
  getEventAnalytics
);

router
  .route("/:id")
  .get(getEventById)
  .put(protect, authorize("organizer", "admin"), updateEvent)
  .delete(protect, authorize("organizer", "admin"), deleteEvent);

module.exports = router;
