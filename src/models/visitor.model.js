const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  scheduledAt: Date,
  imageUrl: String,
  registeredAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  verificationResult: {
    match: Boolean,
    confidence: Number,
    verifiedImageUrl: String,
  }
});

module.exports = mongoose.model('Visitor', visitorSchema);
