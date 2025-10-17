const express = require("express");
const router = express.Router();
const {
  applyForVolunteerRole,
  getVolunteerApplications,
  updateApplicationStatus,
} = require("../controllers/volunteerController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/apply/:eventId", protect, applyForVolunteerRole);

router.get(
  "/applications/:eventId",
  protect,
  authorize("organizer", "admin"),
  getVolunteerApplications
);

router.put(
  "/assignments/:assignmentId",
  protect,
  authorize("organizer", "admin"),
  updateApplicationStatus
);

module.exports = router;
