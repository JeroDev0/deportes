const mongoose = require("mongoose");

const CheckInSchema = new mongoose.Schema({
  deportistaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deportista",
    required: true,
  },
  fecha: {
    type: String, // "YYYY-MM-DD" — un check-in por día por deportista
    required: true,
  },
  estadoAnimo: { type: Number, min: 1, max: 10, required: true },
  nivelEstres: { type: Number, min: 1, max: 10, required: true },
  calidadSueno: { type: Number, min: 1, max: 10, required: true },
  fatigaFisica: { type: Number, min: 1, max: 10, required: true },
  motivacion: { type: Number, min: 1, max: 10, required: true },
  notas: { type: String, default: "", maxlength: 500 },
  // Calculado en el servidor: ((estadoAnimo + (11-nivelEstres) + calidadSueno + (11-fatigaFisica) + motivacion) - 5) / 45 * 100
  puntuacionPreparacion: { type: Number, min: 0, max: 100 },
  creadoEn: { type: Date, default: Date.now },
});

// Un único check-in por deportista por día
CheckInSchema.index({ deportistaId: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model("CheckIn", CheckInSchema);
