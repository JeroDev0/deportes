const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireSuperAdmin = require("../middleware/requireSuperAdmin");
const Recurso = require("../models/Recurso");

// ── GET /recursos — listar todos los recursos activos (deportistas autenticados) ──
router.get("/", auth, async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = { activo: true };
    if (categoria) filtro.categoria = categoria;
    const recursos = await Recurso.find(filtro).sort({ creadoEn: -1 });
    res.json(recursos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los recursos" });
  }
});

// ── POST /recursos — crear recurso (solo admin) ─────────────────────────────
router.post("/", auth, requireSuperAdmin, async (req, res) => {
  try {
    const recurso = new Recurso(req.body);
    await recurso.save();
    res.status(201).json(recurso);
  } catch (err) {
    res.status(400).json({ error: "Error al crear el recurso", details: err.message });
  }
});

// ── PUT /recursos/:id — actualizar recurso (solo admin) ─────────────────────
router.put("/:id", auth, requireSuperAdmin, async (req, res) => {
  try {
    req.body.actualizadoEn = new Date();
    const recurso = await Recurso.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!recurso) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(recurso);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar el recurso" });
  }
});

// ── DELETE /recursos/:id — desactivar recurso (solo admin) ──────────────────
router.delete("/:id", auth, requireSuperAdmin, async (req, res) => {
  try {
    await Recurso.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ message: "Recurso desactivado" });
  } catch (err) {
    res.status(500).json({ error: "Error al desactivar el recurso" });
  }
});

module.exports = router;
