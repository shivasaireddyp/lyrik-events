const mongoose = require('mongoose');

const volunteerAssignmentSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Approved', 'Rejected'],
    default: 'Applied',
  },
}, {
  timestamps: true,
});

const VolunteerAssignment = mongoose.model('VolunteerAssignment', volunteerAssignmentSchema);

module.exports = VolunteerAssignment;