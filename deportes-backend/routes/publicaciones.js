const express = require("express");
const router = express.Router();
const Publicacion = require("../models/Publicacion");
const Deportista = require("../models/Deportista");

// Obtener publicaciones de un usuario
router.get("/", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: "Falta el parámetro user" });
    const publicaciones = await Publicacion.find({ user }).sort({ createdAt: -1 });
    res.json(publicaciones);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

// Crear nueva publicación
router.post("/", async (req, res) => {
  try {
    const { user, text, type, mediaUrl } = req.body;
    if (!user || !text || !type) return res.status(400).json({ error: "Faltan campos obligatorios" });
    const nueva = new Publicacion({ user, text, type, mediaUrl });
    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: "Error al crear publicación", details: err.message });
  }
});

// Like/Unlike
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const publicacion = await Publicacion.findById(req.params.id);
    if (!publicacion) return res.status(404).json({ error: "Publicación no encontrada" });

    const index = publicacion.likes.indexOf(userId);
    if (index === -1) {
      publicacion.likes.push(userId);
    } else {
      publicacion.likes.splice(index, 1);
    }
    await publicacion.save();
    res.json({ likes: publicacion.likes.length });
  } catch (err) {
    res.status(400).json({ error: "Error al dar like", details: err.message });
  }
});

// Editar publicación
router.put("/:id", async (req, res) => {
  try {
    const { text, mediaUrl, type } = req.body;
    const updated = await Publicacion.findByIdAndUpdate(
      req.params.id,
      { text, mediaUrl, type },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "No encontrada" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error al editar", details: err.message });
  }
});

// Eliminar publicación
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Publicacion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "No encontrada" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Error al eliminar", details: err.message });
  }
});
module.exports = router;