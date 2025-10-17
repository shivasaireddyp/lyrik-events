const Venue = require("../models/Venue");
const mongoose = require("mongoose");
const Event = require("../models/Event");

// @desc    Get all venues
// @route   GET /api/venues
// @access  Private (Organizer or Admin)
const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isAvailable: true });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new venue
// @route   POST /api/venues
// @access  Private (Admin only)
const createVenue = async (req, res) => {
  const { name, capacity, cost } = req.body;

  if (!name || !capacity) {
    return res.status(400).json({ message: "Name and capacity are required" });
  }

  try {
    const venue = new Venue({
      name,
      capacity,
      cost,
    });

    const createdVenue = await venue.save();
    res.status(201).json(createdVenue);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a venue
// @route   PUT /api/venues/:id
// @access  Private (Admin only)
const updateVenue = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Invalid venue ID format" });
  }

  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get venue availability and booked slots for a specific date
// @route   GET /api/venues/availability
// @access  Private (Organizer or Admin)
const getVenueAvailability = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ message: "A date query parameter (YYYY-MM-DD) is required." });
  }

  try {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const availableVenues = await Venue.find({ isAvailable: true }).lean();

    const venueIds = availableVenues.map((v) => v._id);
    const bookedEvents = await Event.find({
      venue: { $in: venueIds },
      startTime: { $lt: endOfDay },
      endTime: { $gt: startOfDay },
    })
      .select("title startTime endTime venue")
      .sort({ startTime: 1 });

    const eventsByVenue = {};
    for (const event of bookedEvents) {
      const venueIdString = event.venue.toString();
      if (!eventsByVenue[venueIdString]) {
        eventsByVenue[venueIdString] = [];
      }
      eventsByVenue[venueIdString].push({
        eventTitle: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
      });
    }

    const availabilityData = availableVenues.map((venue) => {
      const venueIdString = venue._id.toString();
      return {
        _id: venue._id,
        name: venue.name,
        capacity: venue.capacity,
        bookedSlots: eventsByVenue[venueIdString] || [],
      };
    });

    res.json(availabilityData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching availability" });
  }
};

module.exports = {
  getAllVenues,
  createVenue,
  updateVenue,
  getVenueAvailability,
};
