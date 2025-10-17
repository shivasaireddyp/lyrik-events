const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'],
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId, // A special type for IDs
    ref: 'User', // Refers to the 'User' model
    required: true,
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue', // Refers to the 'Venue' model
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },

}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;