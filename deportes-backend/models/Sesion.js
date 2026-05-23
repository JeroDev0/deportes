const mongoose = require("mongoose");

const SesionSchema = new mongoose.Schema({
  deportistaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deportista",
    required: true,
  },
  profesionalNombre: { type: String, required: true },
  profesionalEspecialidad: {
    type: String,
    enum: ["psicologo_deporte", "coach_recuperacion", "nutricionista_rendimiento"],
    required: true,
  },
  modalidad: {
    type: String,
    enum: ["video_call", "presencial"],
    required: true,
  },
  fechaSolicitada: { type: String, required: true }, // "YYYY-MM-DD"
  horaInicio: { type: String, default: "" }, // "10:00"
  horaFin: { type: String, default: "" },   // "11:00"
  estado: {
    type: String,
    enum: ["pendiente", "confirmada", "completada", "cancelada", "rechazada"],
    default: "pendiente",
  },
  notasDeportista: { type: String, default: "", maxlength: 1000 },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sesion", SesionSchema);
