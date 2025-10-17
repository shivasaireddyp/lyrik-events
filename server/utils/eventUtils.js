const Event = require('../models/Event');

/**
 * Checks for a scheduling conflict for a given venue and time.
 * @param {string} venue - The ID of the venue to check.
 * @param {Date} startTime - The start time of the proposed event.
 * @param {Date} endTime - The end time of the proposed event.
 * @param {string|null} eventIdToExclude - The ID of an event to exclude from the check (used for updates).
 * @returns {Promise<object|null>} - The conflicting event document if one is found, otherwise null.
 */
const findConflictingEvent = async (venue, startTime, endTime, eventIdToExclude = null) => {
  // Build the base query to find a conflicting event
  const query = {
    venue: venue,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  };

  // If we are updating an event, we must exclude it from the search
  if (eventIdToExclude) {
    query._id = { $ne: eventIdToExclude }; // $ne means 'not equal'
  }

  const conflictingEvent = await Event.findOne(query);
  
  return conflictingEvent;
};

module.exports = { findConflictingEvent };