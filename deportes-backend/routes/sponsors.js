// routes/sponsors.js (o donde tengas las rutas de sponsor)
const express = require("express");
const router = express.Router();
const Sponsor = require("../models/Sponsor");
const multer = require("multer");
const { storage } = require("../cloudinary"); // Si usas Cloudinary
const upload = multer({ storage });

router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const { id } = useParams();
    const updateData = { ...req.body };

    // 1. Procesar la imagen si se subió una nueva
    if (req.file) {
      updateData.logo = req.file.path;
    }

    // 2. IMPORTANTE: Parsear los campos que vienen como JSON string desde el FormData
    if (updateData.sports) {
      try {
        updateData.sports = JSON.parse(updateData.sports);
      } catch (e) {
        // Si ya es un array o falla el parse, lo dejamos como está
      }
    }
    if (updateData.categories) {
      try {
        updateData.categories = JSON.parse(updateData.categories);
      } catch (e) { }
    }
    if (updateData.athletes) {
      try {
        updateData.athletes = JSON.parse(updateData.athletes);
      } catch (e) { }
    }
    if (updateData.clubs) {
      try {
        updateData.clubs = JSON.parse(updateData.clubs);
      } catch (e) { }
    }

    // 3. Actualizar en la base de datos
    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSponsor) {
      return res.status(404).json({ error: "Sponsor no encontrado" });
    }

    console.log("✅ Sponsor actualizado:", updatedSponsor.company);
    res.json(updatedSponsor);
  } catch (err) {
    console.error("❌ Error actualizando sponsor:", err);
    res.status(500).json({ error: "Error al actualizar", details: err.message });
  }
});

module.exports = router;