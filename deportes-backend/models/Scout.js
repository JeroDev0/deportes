const mongoose = require("mongoose");

const ScoutSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // igual que atleta
  name: String,
  lastName: String,
  company: String,
  certifications: [String],
  country: String,
  city: String,
  profileType: { type: String, default: "scout" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Scout", ScoutSchema);