const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireSuperAdmin = require("../middleware/requireSuperAdmin");
const Sesion = require("../models/Sesion");

// ── GET /sesiones/my — sesiones del deportista autenticado ─────────────────
router.get("/my", auth, async (req, res) => {
  try {
    const sesiones = await Sesion.find({ deportistaId: req.user.id }).sort({ fechaSolicitada: -1 });
    res.json(sesiones);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las sesiones" });
  }
});

// ── POST /sesiones — solicitar sesión (solo deportistas) ───────────────────
router.post("/", auth, async (req, res) => {
  try {
    if (req.modelType !== "deportista") {
      return res.status(403).json({ error: "Solo deportistas pueden solicitar sesiones" });
    }
    const sesion = new Sesion({ ...req.body, deportistaId: req.user.id });
    await sesion.save();
    res.status(201).json(sesion);
  } catch (err) {
    res.status(400).json({ error: "Error al crear la sesión", details: err.message });
  }
});

// ── PUT /sesiones/:id/notas — el deportista guarda sus notas post-sesión ────
router.put("/:id/notas", auth, async (req, res) => {
  try {
    const sesion = await Sesion.findOne({ _id: req.params.id, deportistaId: req.user.id });
    if (!sesion) return res.status(404).json({ error: "Sesión no encontrada" });
    sesion.notasDeportista = req.body.notas || "";
    sesion.actualizadoEn = new Date();
    await sesion.save();
    res.json(sesion);
  } catch (err) {
    res.status(400).json({ error: "Error al guardar las notas" });
  }
});

// ── PUT /sesiones/:id/estado — admin cambia el estado de una sesión ─────────
router.put("/:id/estado", auth, requireSuperAdmin, async (req, res) => {
  try {
    const sesion = await Sesion.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado, actualizadoEn: new Date() },
      { new: true }
    );
    if (!sesion) return res.status(404).json({ error: "Sesión no encontrada" });
    res.json(sesion);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar el estado" });
  }
});

// ── GET /sesiones/all — admin ve todas las sesiones ─────────────────────────
router.get("/all", auth, requireSuperAdmin, async (req, res) => {
  try {
    const sesiones = await Sesion.find().populate("deportistaId", "name lastName sport").sort({ creadoEn: -1 });
    res.json(sesiones);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las sesiones" });
  }
});

module.exports = router;
