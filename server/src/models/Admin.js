const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    systemId: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);

