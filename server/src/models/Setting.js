const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    votingStatus: { type: String, enum: ['open', 'closed', 'ended'], default: 'closed' },
    scheduledStartAt: { type: Date, default: null },
    scheduledEndAt: { type: Date, default: null },
    scheduleMessage: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);

