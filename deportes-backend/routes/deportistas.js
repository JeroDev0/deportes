console.log("Cargando rutas de deportistas");
const express = require("express");
const router = express.Router();
const Deportista = require("../models/Deportista");
const Scout = require("../models/Scout");
const Sponsor = require("../models/Sponsor");
const Club = require("../models/Club");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura multer (solo memoria, no disco)
const upload = multer();

// ============================
// RUTAS DE DEPORTISTAS
// ============================

// Obtener todos los deportistas (con populate)
router.get("/", async (req, res) => {
  try {
    const deportistas = await Deportista.find()
      .populate("scout")
      .populate("sponsor")
      .populate("club");
    res.json(deportistas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los deportistas" });
  }
});

// Registrar un nuevo deportista
router.post("/", async (req, res) => {
  try {
    const {
      email,
      password,
      profileType,
      name,
      lastName,
      age,
      sport,
      gender,
      phone,
      country,
      city,
      photo,
      about,
      experience,
      recognitions,
      skills,
      certifications,
      level,
      scout,
      sponsor,
      club,
    } = req.body;

    const nuevoDeportista = new Deportista({
      email,
      password,
      profileType,
      name,
      lastName,
      age,
      sport,
      gender,
      phone,
      country,
      city,
      photo,
      about,
      experience,
      recognitions,
      skills,
      certifications,
      level,
      scout,
      sponsor,
      club,
    });

    await nuevoDeportista.save();
    res.status(201).json(nuevoDeportista);
  } catch (err) {
    res.status(400).json({
      error: "Error al registrar el deportista",
      details: err.message,
    });
  }
});

// Actualizar perfil de un deportista (con foto y relaciones)
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    let updateFields = { ...req.body };

    // Convertir arrays enviados como string a array
    ["experience", "recognitions", "skills", "certifications"].forEach(
      (field) => {
        if (updateFields[field]) {
          if (Array.isArray(updateFields[field])) {
            // ya es array
          } else if (typeof updateFields[field] === "string") {
            updateFields[field] = [updateFields[field]];
          } else {
            updateFields[field] = [];
          }
        }
      }
    );

    // Manejar foto en Cloudinary
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "deportistas" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file.buffer);
      updateFields.photo = result.secure_url;
    }

    // ✅ Manejar relaciones (scout, sponsor, club)
    if (updateFields.scout === "") updateFields.scout = null;
    if (updateFields.sponsor === "") updateFields.sponsor = null;
    if (updateFields.club === "") updateFields.club = null;

    const deportista = await Deportista.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    )
      .populate("scout")
      .populate("sponsor")
      .populate("club");

    if (!deportista)
      return res.status(404).json({ error: "Deportista no encontrado" });

    res.json(deportista);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error al actualizar el perfil", details: err.message });
  }
});

// Obtener un deportista por ID
router.get("/:id", async (req, res) => {
  try {
    const deportista = await Deportista.findById(req.params.id, "-password")
      .populate("scout")
      .populate("sponsor")
      .populate("club");
    if (!deportista)
      return res.status(404).json({ error: "Deportista no encontrado" });
    res.json(deportista);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el deportista" });
  }
});

module.exports = router;