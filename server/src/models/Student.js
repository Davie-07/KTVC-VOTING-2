const mongoose = require('mongoose');
const { admissionMin, admissionMax } = require('../utils/constants');

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    admissionNumber: {
      type: Number,
      required: true,
      unique: true,
      min: admissionMin,
      max: admissionMax
    },
    passwordHash: { type: String, required: true },
    votesByPosition: {
      // position -> contestantId
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);

