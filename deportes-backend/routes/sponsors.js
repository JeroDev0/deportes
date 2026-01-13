const express = require("express");
const router = express.Router();
const Sponsor = require("../models/Sponsor");

// ==================== GET ALL SPONSORS ====================
router.get("/", async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.json(sponsors);
  } catch (err) {
    console.error("❌ Error obteniendo sponsors:", err);
    res.status(500).json({ error: "Error al obtener los sponsors" });
  }
});

// ==================== CREATE SPONSOR ====================
router.post("/", async (req, res) => {
  try {
    const sponsor = new Sponsor(req.body);
    await sponsor.save();
    console.log("✅ Sponsor creado:", sponsor.company);
    res.status(201).json(sponsor);
  } catch (err) {
    console.error("❌ Error creando sponsor:", err);
    res.status(400).json({ error: err.message });
  }
});

// ==================== GET SPONSOR BY ID ====================
router.get("/:id", async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id, "-password")
      .populate("athletes", "name lastName photo sport")
      .populate("clubs", "name city");
    
    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor no encontrado" });
    }
    
    res.json(sponsor);
  } catch (err) {
    console.error("❌ Error obteniendo sponsor:", err);
    res.status(500).json({ error: "Error al obtener el sponsor" });
  }
});

// ==================== UPDATE SPONSOR ====================
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ CLAVE: Parsear arrays que vienen como JSON string desde FormData
    const parseIfString = (field) => {
      if (typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch {
          return field; // Si no es JSON válido, devolver tal cual
        }
      }
      return field; // Si ya es array u objeto, devolver tal cual
    };

    // Parsear todos los campos array
    if (updateData.sports) {
      updateData.sports = parseIfString(updateData.sports);
    }
    if (updateData.categories) {
      updateData.categories = parseIfString(updateData.categories);
    }
    if (updateData.athletes) {
      updateData.athletes = parseIfString(updateData.athletes);
    }
    if (updateData.clubs) {
      updateData.clubs = parseIfString(updateData.clubs);
    }

    const sponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Devolver el documento actualizado
        runValidators: true, // Validar según el schema
      }
    );

    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor no encontrado" });
    }

    console.log("✅ Sponsor actualizado:", sponsor.company);
    res.json(sponsor);
  } catch (err) {
    console.error("❌ Error actualizando sponsor:", err);
    res.status(400).json({ 
      error: "Error al actualizar sponsor",
      details: err.message 
    });
  }
});

// ==================== DELETE SPONSOR ====================
router.delete("/:id", async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    
    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor no encontrado" });
    }
    
    console.log("✅ Sponsor eliminado:", sponsor.company);
    res.json({ msg: "Sponsor eliminado", sponsor });
  } catch (err) {
    console.error("❌ Error eliminando sponsor:", err);
    res.status(500).json({ error: "Error al eliminar sponsor" });
  }
});

module.exports = router;