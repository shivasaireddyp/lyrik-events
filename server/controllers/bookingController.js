const Booking = require("../models/Booking");
const Event = require("../models/Event");
const mongoose = require("mongoose");
const { generateGoogleCalendarLink } = require("../utils/calendarUtils");
const { v4: uuidv4 } = require("uuid");

const initiateBooking = async (req, res) => {
  const { eventId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new Error("Event not found");
    }

    const existingBookingsCount = await Booking.countDocuments({
      event: eventId,
      status: { $in: ["confirmed", "pending"] },
    }).session(session);

    if (existingBookingsCount >= event.capacity) {
      await session.abortTransaction();
      return res
        .status(409)
        .json({ message: "Sorry, this event is fully booked." });
    }

    const userAlreadyBooked = await Booking.findOne({
      event: eventId,
      user: req.user._id,
      status: { $in: ["confirmed", "pending"] },
    }).session(session);

    if (userAlreadyBooked) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "You have already booked this event." });
    }

    const expirationTime = new Date(Date.now() + 2 * 60 * 1000);
    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      status: "pending",
      expiresAt: expirationTime,
    });
    await booking.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: "Booking initiated. Please proceed to payment within 5 minutes.",
      bookingId: booking._id,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: "Server error while initiating booking" });
  } finally {
    session.endSession();
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("event", "title");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const eventDetails = await Event.findById(booking.event._id).populate(
      "venue",
      "name"
    );
    const googleCalendarUrl = generateGoogleCalendarLink(eventDetails);

    res.json({ booking, googleCalendarUrl });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "pending",
    });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Pending booking not found. It may have expired." });
    }

    booking.status = "confirmed";
    booking.qrCodeData = uuidv4();
    booking.expiresAt = undefined;
    const confirmedBooking = await booking.save();

    const eventDetails = await Event.findById(booking.event).populate(
      "venue",
      "name"
    );
    const googleCalendarUrl = generateGoogleCalendarLink(eventDetails);

    res.json({
      message: "Booking confirmed successfully!",
      booking: confirmedBooking,
      googleCalendarUrl: googleCalendarUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while confirming booking" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: { $in: ["confirmed", "cancelled"] },
    }).populate({
      path: "event",
      select: " _id title startTime category",
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error in getMyBookings:", error);
    res.status(500).json({ message: "Server error from here" });
  }
};

const verifyBooking = async (req, res) => {
  const { qrCodeData, eventId } = req.body;

  if (!qrCodeData || !eventId) {
    return res
      .status(400)
      .json({ message: "QR code data and Event ID are required" });
  }

  try {
    const booking = await Booking.findOne({ qrCodeData, event: eventId })
      .populate("user", "name")
      .populate("event", "title");

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Invalid Ticket. Not found for this event." });
    }

    if (booking.isCheckedIn) {
      return res.status(400).json({
        message: "This ticket has already been used.",
        bookingDetails: {
          userName: booking.user.name,
          eventTitle: booking.event.title,
        },
      });
    }

    booking.isCheckedIn = true;
    await booking.save();

    res.json({
      message: "Check-in successful!",
      bookingDetails: {
        userName: booking.user.name,
        eventTitle: booking.event.title,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during verification" });
  }
};

const cancelBooking = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Invalid booking ID format" });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "This booking has already been cancelled." });
    }

    booking.status = "cancelled";
    const updatedBooking = await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while cancelling booking" });
  }
};

module.exports = {
  getMyBookings,
  verifyBooking,
  cancelBooking,
  initiateBooking,
  confirmBooking,
  getBookingById,
};
