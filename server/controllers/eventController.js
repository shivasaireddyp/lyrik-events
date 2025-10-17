const Event = require("../models/Event");
const Venue = require("../models/Venue"); // We'll need this to check venue validity
const Booking = require("../models/Booking"); // We'll need this to check venue validity
const mongoose = require("mongoose");
const { findConflictingEvent } = require("../utils/eventUtils");

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({
      startTime: -1,
    });
    res.json(events);
  } catch (error) {
    console.error("Error in getMyEvents:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createEvent = async (req, res) => {
  const {
    title,
    description,
    category,
    startTime,
    endTime,
    venue,
    capacity,
    deadline,
  } = req.body;

  try {
    if (
      (!title || !description || !category || !startTime || !endTime || !venue,
      !capacity)
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      return res.status(404).json({ message: "Venue not found" });
    }

    if (!venueExists.isAvailable) {
      return res
        .status(400)
        .json({ message: "This venue is currently unavailable for booking." });
    }

    if (deadline > startTime) {
      return res
        .status(400)
        .json({
          message: "Registration deadline must be before event start time",
        });
    }

    // if (parseInt(capacity, 10) > venueDoc.capacity) {
    //   return res.status(400).json({
    //     message: `Event capacity (${capacity}) cannot exceed venue capacity (${venueDoc.capacity}).`,
    //   });
    // }
    const conflictingEvent = await findConflictingEvent(
      venue,
      startTime,
      endTime
    );

    if (conflictingEvent) {
      return res.status(409).json({
        message: "Venue is already booked for this time slot.",
        conflictingEvent: { title: conflictingEvent.title },
      });
    }

    const event = new Event({
      title,
      description,
      category,
      startTime,
      endTime,
      venue,
      capacity,
      organizer: req.user._id,
      deadline,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating event" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.venue) {
      filter.venue = req.query.venue;
    }

    const now = new Date();
    if (req.query.time === "past") {
      filter.startTime = { $lt: now };
    } else {
      filter.startTime = { $gte: now };
    }

    const events = await Event.find(filter)
      .sort({ startTime: 1 })
      .populate("organizer", "name email")
      .populate("venue", "name");

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEventById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Invalid event ID format" });
  }

  try {
    const rawEvent = await Event.findById(req.params.id);

    if (!rawEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const populatedEvent = await Event.populate(rawEvent, [
      { path: "organizer", select: "name email" },
      { path: "venue", select: "name" },
    ]);

    res.json(populatedEvent);
  } catch (error) {
    console.error("Error in getEventById:", error);
    res.status(500).json({ message: "Server error while fetching event" });
  }
};
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(404).json({ message: "Invalid event ID format" });
//   }

//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     if (new Date(endTime) <= new Date(startTime)) {
//       return res
//         .status(400)
//         .json({ message: "End time must be after start time" });
//     }

//     if (deadline > startTime) {
//       return res
//         .status(400)
//         .json({
//           message: "Registration deadline must be before event start time",
//         });
//     }

//     if (parseInt(capacity, 10) > venueDoc.capacity) {
//       return res.status(400).json({
//         message: `Event capacity (${capacity}) cannot exceed venue capacity (${venueDoc.capacity}).`,
//       });
//     }

//     const conflictingEvent = await findConflictingEvent(
//       venue,
//       startTime,
//       endTime
//     );

//     if (conflictingEvent) {
//       return res.status(409).json({
//         message: "Venue is already booked for this time slot.",
//         conflictingEvent: { title: conflictingEvent.title },
//       });
//     }

//     const updatedEvent = await Event.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.json(updatedEvent);
//   } catch (error) {
//     res.status(500).json({ message: "Server error while updating event" });
//   }
// };

const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid event ID format" });
  }

  const { title, startTime, endTime, deadline, capacity, venue, ...rest } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (new Date(deadline) >= new Date(startTime)) {
      return res.status(400).json({
        message: "Registration deadline must be before event start time",
      });
    }

    // Validate venue and capacity
    const venueDoc = await Venue.findById(venue);
    if (!venueDoc) {
      return res.status(404).json({ message: "Venue not found" });
    }

    if (parseInt(capacity, 10) > venueDoc.capacity) {
      return res.status(400).json({
        message: `Event capacity (${capacity}) cannot exceed venue capacity (${venueDoc.capacity}).`,
      });
    }

    // Check for conflicting events (exclude current event)
    const conflictingEvent = await findConflictingEvent(
      venue,
      startTime,
      endTime,
      id
    );

    if (conflictingEvent) {
      return res.status(409).json({
        message: "Venue is already booked for this time slot.",
        conflictingEvent: { title: conflictingEvent.title },
      });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, startTime, endTime, deadline, capacity, venue, ...rest },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Server error while updating event" });
  }
};


const deleteEvent = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Invalid event ID format" });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting event" });
  }
};

const getEventAnalytics = async (req, res) => {
  try {
    const eventId = req.params.id;

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
        .json({ message: "User not authorized for this event" });
    }

    const [totalRegistrations, totalCheckIns, attendees] = await Promise.all([
      Booking.countDocuments({ event: eventId, status: "confirmed" }),
      Booking.countDocuments({
        event: eventId,
        status: "confirmed",
        isCheckedIn: true,
      }),
      Booking.find({ event: eventId, status: "confirmed" }).populate(
        "user",
        "name email"
      ),
    ]);

    const checkInRate =
      totalRegistrations > 0 ? (totalCheckIns / totalRegistrations) * 100 : 0;

    res.json({
      eventTitle: event.title,
      totalRegistrations,
      totalCheckIns,
      checkInRate: checkInRate.toFixed(2),
      attendees: attendees.map((b) => ({
        name: b.user.name,
        email: b.user.email,
        isCheckedIn: b.isCheckedIn,
      })),
    });
  } catch (error) {
    console.error("Error in getEventAnalytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getEventAnalytics,
};
