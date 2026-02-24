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

  // 📋 Datos básicos
  name: { type: String, default: "" },
  lastName: { type: String, default: "" },
  age: { type: Number, default: null },
  sport: { type: String, default: "" },
  gender: { type: String, default: "" },
  phone: { type: String, default: "" },

  // 🏠 Información de nacimiento
  birthCountry: { type: String, default: "" },
  birthCity: { type: String, default: "" },

  // 🌍 Información actual/residencia
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  address: { type: String, default: "" },

  photo: { type: String, default: "" },

  // 📝 Descripciones
  about: { type: String, default: "" },
  shortDescription: { type: String, default: "" },

  // 🏅 Experiencias y logros
  experience: { type: [String], default: [] },
  recognitions: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },

  registrationDate: { type: Date, default: Date.now },

  // 🔗 Relaciones con BD (IDs)
  scout: { type: mongoose.Schema.Types.ObjectId, ref: "Scout", default: null },
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "Sponsor", default: null },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", default: null },

  // ⭐ NUEVOS CAMPOS - Relaciones como texto libre
  scoutName: { type: String, default: "" },
  sponsorName: { type: String, default: "" },
  clubName: { type: String, default: "" },

  // ⚡ Nivel
  level: {
    type: String,
    enum: ["amateur", "semi profesional", "profesional"],
    default: "amateur",
  },
  // 🔐 Recuperación de contraseña
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

module.exports = mongoose.model("Deportista", DeportistaSchema);