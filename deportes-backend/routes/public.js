const express = require("express");
const router = express.Router();
const Deportista = require("../models/Deportista");
const Scout = require("../models/Scout");
const Sponsor = require("../models/Sponsor");

// Datos públicos mínimos: nunca email, teléfono, contraseña ni tokens
router.get("/map-points", async (req, res) => {
  try {
    const [athletes, scouts, sponsors] = await Promise.all([
      Deportista.find({ isApproved: true, country: { $ne: "" } })
        .select("name lastName photo sport city country")
        .limit(200)
        .lean(),
      Scout.find({ country: { $ne: "" } })
        .select("name lastName photo specialization city country")
        .limit(200)
        .lean(),
      Sponsor.find({ country: { $ne: "" } })
        .select("company logo industry city country")
        .limit(200)
        .lean(),
    ]);

    res.json({
      athletes: athletes.map(a => ({ ...a, _type: "athlete" })),
      scouts: scouts.map(s => ({ ...s, _type: "scout" })),
      sponsors: sponsors.map(s => ({ ...s, _type: "sponsor" })),
    });
  } catch (err) {
    console.error("❌ Error en map-points:", err);
    res.status(500).json({ error: "Error al obtener los puntos del mapa" });
  }
});

// Un deportista aleatorio con perfil completo para la vitrina del Home
router.get("/featured-athlete", async (req, res) => {
  try {
    const [athlete] = await Deportista.aggregate([
      { $match: { isApproved: true, name: { $ne: "" }, photo: { $ne: "" } } },
      { $sample: { size: 1 } },
      {
        $project: {
          name: 1,
          lastName: 1,
          photo: 1,
          sport: 1,
          level: 1,
          city: 1,
          country: 1,
          birthDate: 1,
          shortDescription: 1,
          about: 1,
          skills: 1,
          experience: 1,
        },
      },
    ]);

    if (!athlete) return res.status(404).json({ error: "No hay deportistas disponibles" });

    res.json({
      ...athlete,
      experience: (athlete.experience || []).slice(0, 2),
      skills: (athlete.skills || []).slice(0, 2),
    });
  } catch (err) {
    console.error("❌ Error en featured-athlete:", err);
    res.status(500).json({ error: "Error al obtener el deportista destacado" });
  }
});

module.exports = router;
