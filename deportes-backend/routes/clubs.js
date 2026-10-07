const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Club = require("../models/Club");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer();

const PUBLIC_LIST_FIELDS = "name photo city country sports entityType founded";
const PRIVATE_FIELDS = "-password -resetPasswordToken -resetPasswordExpires -__v";

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "clubs" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ==================== GET ALL CLUBS ====================
router.get("/", auth, async (req, res) => {
  try {
    const clubs = await Club.find().select(PUBLIC_LIST_FIELDS);
    res.json(clubs);
  } catch (err) {
    console.error("❌ Error obteniendo clubs:", err);
    res.status(500).json({ error: "Error al obtener los clubs" });
  }
});

// ==================== CREATE CLUB ====================
router.post("/", async (req, res) => {
  try {
    const club = new Club(req.body);
    await club.save();
    console.log("✅ Club creado:", club.name);
    res.status(201).json(club);
  } catch (err) {
    console.error("❌ Error creando club:", err);
    res.status(400).json({ error: err.message });
  }
});

// ==================== GET CLUB BY ID ====================
router.get("/:id", auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).select(PRIVATE_FIELDS);
    if (!club) return res.status(404).json({ error: "Club no encontrado" });
    res.json(club);
  } catch (err) {
    console.error("❌ Error obteniendo club:", err);
    res.status(500).json({ error: "Error al obtener el club" });
  }
});

// ==================== UPDATE CLUB ====================
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const clubData = {};

    const stringFields = ["name", "entityType", "founded", "country", "city", "about", "shortDescription"];
    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const value = req.body[field];
        clubData[field] = (value === null || value === "null" || value === "undefined")
          ? ""
          : String(value).trim();
      }
    });

    if (req.body.sports !== undefined) {
      let sportsArray;
      if (Array.isArray(req.body.sports)) {
        sportsArray = req.body.sports;
      } else {
        try {
          sportsArray = JSON.parse(req.body.sports);
        } catch {
          sportsArray = [req.body.sports];
        }
      }
      clubData.sports = sportsArray.filter(Boolean);
    }

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      clubData.photo = result.secure_url;
    }

    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { $set: clubData },
      { new: true, runValidators: true }
    ).select(PRIVATE_FIELDS);

    if (!club) return res.status(404).json({ error: "Club no encontrado" });

    console.log("✅ Club actualizado:", club.name);
    res.json(club);
  } catch (err) {
    console.error("❌ Error actualizando club:", err);
    res.status(400).json({ error: "Error al actualizar club", details: err.message });
  }
});

// ==================== DELETE CLUB ====================
router.delete("/:id", async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ error: "Club no encontrado" });
    res.json({ msg: "Club eliminado", club });
  } catch (err) {
    console.error("❌ Error eliminando club:", err);
    res.status(500).json({ error: "Error al eliminar club" });
  }
});

module.exports = router;
