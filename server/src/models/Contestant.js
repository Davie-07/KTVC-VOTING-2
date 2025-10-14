const mongoose = require('mongoose');
// Positions are free-form to allow colleges to define roles (e.g., CU LEADER)

const contestantSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    manifesto: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    imageMeta: {
      width: Number,
      height: Number,
      format: String,
      sizeKb: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contestant', contestantSchema);

