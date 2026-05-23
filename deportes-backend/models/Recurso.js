const mongoose = require("mongoose");

const RecursoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  categoria: {
    type: String,
    enum: ["respiracion_foco", "optimizacion_sueno", "fortaleza_mental", "recuperacion"],
    required: true,
  },
  descripcionBreve: { type: String, required: true, maxlength: 300 },
  contenido: { type: String, required: true },
  tipo: {
    type: String,
    enum: ["articulo", "video", "ejercicio"],
    required: true,
  },
  tiempoEstimado: { type: String, default: "" }, // "5 Min", "12 Min Lectura"
  intensidad: {
    type: String,
    enum: ["bajo", "medio", "alto"],
    default: "bajo",
  },
  // Qué estados de check-in activan la recomendación automática
  // Ej: ["estres_alto", "sueno_malo"]
  triggerCondiciones: { type: [String], default: [] },
  activo: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recurso", RecursoSchema);
