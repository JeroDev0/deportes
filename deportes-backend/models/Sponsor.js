// models/Sponsor.js
const mongoose = require("mongoose");

const SponsorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Identidad
  name: String, // nombre del contacto
  company: { type: String, required: true }, // nombre empresa/marca
  industry: String,

  // Perfil
  logo: String,
  about: String,
  shortDescription: String,

  // Alcance deportivo
  sports: [String],          // ej: Soccer, Cycling
  categories: [String],      // ej: Sub15, Elite (del Word)
  countries: [String],       // países donde opera

  // Ubicación principal
  country: String,
  city: String,

  // Relaciones
  athletes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deportista" }],
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  scouts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scout" }],

  profileType: { type: String, default: "sponsor" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sponsor", SponsorSchema);