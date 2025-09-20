const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  country: String,
  city: String,
  founded: Date,
  profileType: { type: String, default: "club" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Club", ClubSchema);