const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends
  },
  capacity: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;