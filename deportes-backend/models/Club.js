const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  lastName: { type: String, default: "" },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  founded: Date,
  sports: { type: [String], default: [] },
  entityType: { type: String, default: "" },
  profileType: { type: String, default: "club" },
  photo: { type: String, default: "" },
  shortDescription: { type: String, default: "" },
  about: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  // 🔐 Recuperación de contraseña
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

module.exports = mongoose.model("Club", ClubSchema);