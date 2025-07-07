const mongoose = require("mongoose");

const PublicacionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Deportista", required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
  mediaUrl: { type: String }, // URL de la imagen o video
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deportista" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Publicacion", PublicacionSchema);