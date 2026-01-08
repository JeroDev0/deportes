const mongoose = require("mongoose");

const ScoutSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileType: {
    type: String,
    default: "scout",
    enum: ["scout"]
  },
  name: { type: String, default: "" },
  lastName: { type: String, default: "" },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "" },
  phone: { type: String, default: "" },
  company: { type: String, default: "" },
  specialization: { type: String, default: "" },
  sports: [String],
  photo: { type: String, default: "" },
  about: { type: String, default: "" },
  shortDescription: { type: String, default: "" },
  experience: [String],
  certifications: [String],
  recognitions: [String],
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  address: { type: String, default: "" },
  birthCountry: { type: String, default: "" },
  birthCity: { type: String, default: "" },
  athletes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deportista" }],
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sponsor" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Scout", ScoutSchema);