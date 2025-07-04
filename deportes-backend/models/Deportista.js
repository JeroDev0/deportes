const mongoose = require("mongoose");

const DeportistaSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileType: {
    type: String,
    enum: ["atleta", "scout", "sponsor", "admin"],
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return this.profileType === "atleta";
    },
  },
  // Campos de perfil extendido:
  name: String,
  lastName: String,
  age: Number,
  sport: String,
  gender: String,
  phone: String,
  country: String,
  city: String,
  photo: String,
  about: String,
  experience: [String],
  recognitions: [String],
  skills: [String],
  certifications: [String], // solo scout y sponsor
  registrationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Deportista", DeportistaSchema);
