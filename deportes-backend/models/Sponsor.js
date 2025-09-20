const mongoose = require("mongoose");

const SponsorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  company: String,
  certifications: [String],
  country: String,
  city: String,
  profileType: { type: String, default: "sponsor" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sponsor", SponsorSchema);