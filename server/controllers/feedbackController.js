const Feedback = require("../models/Feedback");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const mongoose = require("mongoose");

const submitFeedback = async (req, res) => {
  const { eventId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "A rating between 1 and 5 is required." });
  }

  try {
    const booking = await Booking.findOne({
      event: eventId,
      user: req.user._id,
      status: "confirmed",
    }).populate("event");

    if (!booking) {
      return res
        .status(403)
        .json({
          message: "You must have a confirmed booking to leave feedback.",
        });
    }

    if (new Date() < new Date(booking.event.endTime)) {
      return res
        .status(400)
        .json({
          message: "You can only leave feedback after the event has ended.",
        });
    }

    const existingFeedback = await Feedback.findOne({
      event: eventId,
      user: req.user._id,
    });
    if (existingFeedback) {
      return res
        .status(400)
        .json({
          message: "You have already submitted feedback for this event.",
        });
    }

    const feedback = await Feedback.create({
      event: eventId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({ message: "Thank you for your feedback!", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while submitting feedback" });
  }
};

const getFeedbackForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const feedback = await Feedback.find({ event: eventId }).populate(
      "user",
      "name"
    );

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitFeedback,
  getFeedbackForEvent,
};
