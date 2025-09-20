const express = require("express");
const router = express.Router();
const Sponsor = require("../models/Sponsor");

// Obtener todos los sponsors
router.get("/", async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.json(sponsors);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los sponsors" });
  }
});

// Registrar un nuevo sponsor
router.post("/", async (req, res) => {
  try {
    const sponsor = new Sponsor(req.body);
    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener un sponsor por ID
router.get("/:id", async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id, "-password");
    if (!sponsor) return res.status(404).json({ error: "Sponsor no encontrado" });
    res.json(sponsor);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el sponsor" });
  }
});

// Actualizar un sponsor
router.put("/:id", async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!sponsor) return res.status(404).json({ error: "Sponsor no encontrado" });
    res.json(sponsor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un sponsor
router.delete("/:id", async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Sponsor eliminado", sponsor });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar sponsor" });
  }
});

module.exports = router;