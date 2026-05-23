const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const CheckIn = require("../models/CheckIn");

function calcularPuntuacion({ estadoAnimo, nivelEstres, calidadSueno, fatigaFisica, motivacion }) {
  const suma = estadoAnimo + (11 - nivelEstres) + calidadSueno + (11 - fatigaFisica) + motivacion;
  return Math.round(((suma - 5) / 45) * 100);
}

function fechaHoy() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ── POST /checkins — crear o actualizar el check-in de hoy ──────────────────
router.post("/", auth, async (req, res) => {
  try {
    if (req.modelType !== "deportista") {
      return res.status(403).json({ error: "Solo deportistas pueden registrar check-ins" });
    }

    const { estadoAnimo, nivelEstres, calidadSueno, fatigaFisica, motivacion, notas } = req.body;
    const puntuacionPreparacion = calcularPuntuacion({ estadoAnimo, nivelEstres, calidadSueno, fatigaFisica, motivacion });
    const fecha = fechaHoy();

    const checkin = await CheckIn.findOneAndUpdate(
      { deportistaId: req.user.id, fecha },
      { estadoAnimo, nivelEstres, calidadSueno, fatigaFisica, motivacion, notas: notas || "", puntuacionPreparacion },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(checkin);
  } catch (err) {
    console.error("Error check-in:", err);
    res.status(500).json({ error: "Error al guardar el check-in" });
  }
});

// ── GET /checkins/today — check-in de hoy del deportista autenticado ────────
router.get("/today", auth, async (req, res) => {
  try {
    const checkin = await CheckIn.findOne({ deportistaId: req.user.id, fecha: fechaHoy() });
    res.json(checkin || null);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el check-in" });
  }
});

// ── GET /checkins/history — historial completo del deportista autenticado ────
router.get("/history", auth, async (req, res) => {
  try {
    const dias = parseInt(req.query.dias) || 30;
    const checkins = await CheckIn.find({ deportistaId: req.user.id })
      .sort({ fecha: -1 })
      .limit(dias);
    res.json(checkins);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el historial" });
  }
});

module.exports = router;
