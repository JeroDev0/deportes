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

  // 🏠 Información de nacimiento - ESTOS SON LOS CAMPOS PROBLEMÁTICOS
  birthCountry: { type: String, default: "" },
  birthCity: { type: String, default: "" },

  // 🌍 Información actual/residencia - ESTOS SON LOS CAMPOS PROBLEMÁTICOS
  country: { type: String, default: "" },       // País actual
  city: { type: String, default: "" },          // Ciudad actual
  postalCode: { type: String, default: "" },    // Código postal - PROBLEMÁTICO
  address: { type: String, default: "" },       // Dirección completa - PROBLEMÁTICO

  photo: { type: String, default: "" },

  // 📝 Descripciones - ESTE ES PROBLEMÁTICO
  about: { type: String, default: "" },              // Descripción larga
  shortDescription: { type: String, default: "" },   // Descripción corta - PROBLEMÁTICO

  // 🏅 Experiencias y logros
  experience: { type: [String], default: [] },
  recognitions: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] }, // solo scout y sponsor

  registrationDate: { type: Date, default: Date.now },

  // 🔗 Relaciones
  scout: { type: mongoose.Schema.Types.ObjectId, ref: "Scout", default: null },
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "Sponsor", default: null },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", default: null },

  // ⚡ Nivel
  level: {
    type: String,
    enum: ["amateur", "semi profesional", "profesional"],
    default: "amateur",
  },
});

module.exports = mongoose.model("Deportista", DeportistaSchema);