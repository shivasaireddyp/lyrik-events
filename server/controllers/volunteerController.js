const VolunteerAssignment = require("../models/VolunteerAssignment");
const Event = require("../models/Event");
const mongoose = require("mongoose");

// @desc    A user applies to be a volunteer for an event
// @route   POST /api/volunteer/apply/:eventId
// @access  Private
const applyForVolunteerRole = async (req, res) => {
  const { eventId } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "A role is required to apply." });
  }
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(404).json({ message: "Invalid event ID format" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingApplication = await VolunteerAssignment.findOne({
      event: eventId,
      user: req.user._id,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this event." });
    }

    const application = await VolunteerAssignment.create({
      event: eventId,
      user: req.user._id,
      role: role,
      status: "Applied",
    });

    res
      .status(201)
      .json({ message: "Application submitted successfully!", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while applying" });
  }
};

// @desc    Get all volunteer applications for a specific event
// @route   GET /api/volunteer/applications/:eventId
// @access  Private (Event's Organizer or Admin)
const getVolunteerApplications = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to view these applications" });
    }

    const applications = await VolunteerAssignment.find({
      event: eventId,
    }).populate("user", "name email");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a volunteer application's status (Approve/Reject)
// @route   PUT /api/volunteer/assignments/:assignmentId
// @access  Private (Event's Organizer or Admin)
const updateApplicationStatus = async (req, res) => {
  const { assignmentId } = req.params;
  const { status } = req.body;

  if (!status || !["Approved", "Rejected"].includes(status)) {
    return res
      .status(400)
      .json({
        message: 'A valid status ("Approved" or "Rejected") is required.',
      });
  }

  try {
    const assignment = await VolunteerAssignment.findById(
      assignmentId
    ).populate("event");
    if (!assignment) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      assignment.event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this application" });
    }

    assignment.status = status;
    const updatedAssignment = await assignment.save();

    res.json({
      message: "Application status updated successfully!",
      assignment: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  applyForVolunteerRole,
  getVolunteerApplications,
  updateApplicationStatus,
};
