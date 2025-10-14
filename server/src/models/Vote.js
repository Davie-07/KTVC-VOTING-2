const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    contestantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contestant', required: true },
    position: { type: String, required: true },
  },
  { timestamps: true }
);

voteSchema.index({ studentId: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);

