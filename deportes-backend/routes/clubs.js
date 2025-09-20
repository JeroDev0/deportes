const express = require("express");
const router = express.Router();
const Club = require("../models/Club");

// Obtener todos los clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los clubs" });
  }
});

// Registrar un nuevo club
router.post("/", async (req, res) => {
  try {
    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener un club por ID
router.get("/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id, "-password");
    if (!club) return res.status(404).json({ error: "Club no encontrado" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el club" });
  }
});

// Actualizar un club
router.put("/:id", async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!club) return res.status(404).json({ error: "Club no encontrado" });
    res.json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un club
router.delete("/:id", async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    res.json({ msg: "Club eliminado", club });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar club" });
  }
});

module.exports = router;