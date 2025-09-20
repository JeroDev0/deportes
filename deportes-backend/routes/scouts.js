const express = require("express");
const router = express.Router();
const Scout = require("../models/Scout");

// Obtener todos los scouts
router.get("/", async (req, res) => {
  try {
    const scouts = await Scout.find();
    res.json(scouts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los scouts" });
  }
});

// Registrar un nuevo scout
router.post("/", async (req, res) => {
  try {
    const scout = new Scout(req.body);
    await scout.save();
    res.status(201).json(scout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener un scout por ID
router.get("/:id", async (req, res) => {
  try {
    const scout = await Scout.findById(req.params.id, "-password");
    if (!scout) return res.status(404).json({ error: "Scout no encontrado" });
    res.json(scout);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el scout" });
  }
});

// Actualizar un scout
router.put("/:id", async (req, res) => {
  try {
    const scout = await Scout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!scout) return res.status(404).json({ error: "Scout no encontrado" });
    res.json(scout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar un scout
router.delete("/:id", async (req, res) => {
  try {
    const scout = await Scout.findByIdAndDelete(req.params.id);
    res.json({ msg: "Scout eliminado", scout });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar scout" });
  }
});

module.exports = router;