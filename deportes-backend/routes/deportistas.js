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

// Configura multer (solo memoria)
const upload = multer();

// ============================
// RUTAS DE DEPORTISTAS
// ============================

// Obtener todos
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

// Registrar
router.post("/", async (req, res) => {
  try {
    const nuevoDeportista = new Deportista(req.body);
    await nuevoDeportista.save();
    res.status(201).json(nuevoDeportista);
  } catch (err) {
    res.status(400).json({
      error: "Error al registrar el deportista",
      details: err.message,
    });
  }
});

// ============================
// ACTUALIZAR PERFIL
// ============================
router.put("/:id", (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    upload.single("photo")(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  try {
    // Procesar campos string problemáticos
    const stringFields = ['postalCode', 'address', 'birthCountry', 'birthCity', 'shortDescription'];
    stringFields.forEach(field => {
      const value = req.body[field];
      
      // Convertir null, undefined, "null", "undefined" a string vacío
      if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === '') {
        req.body[field] = '';
      } else {
        // Asegurar que sea string
        req.body[field] = String(value).trim();
      }
    });

    // Si viene birthDate, calcular age automáticamente
    if (req.body.birthDate) {
      const birth = new Date(req.body.birthDate);
      if (!isNaN(birth.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        req.body.age = age > 0 ? age : null;
      }
    }

    // Normalizar experience y recognitions como arrays de objetos
    ["experience", "recognitions"].forEach((field) => {
      if (req.body[field] !== undefined) {
        try {
          if (typeof req.body[field] === "string") {
            req.body[field] = JSON.parse(req.body[field]);
          }
          if (Array.isArray(req.body[field])) {
            req.body[field] = req.body[field].filter(
              (item) => item && typeof item === "object" && (item.description || item.startYear || item.endYear)
            );
          } else {
            req.body[field] = [];
          }
        } catch (e) {
          req.body[field] = [];
        }
      }
    });

    // Normalizar skills y certifications como arrays de strings
    ["skills", "certifications"].forEach((field) => {
      if (req.body[field] && !Array.isArray(req.body[field])) {
        req.body[field] = [req.body[field]];
      }
    });

    // Normalizar nationalities (máximo 3)
    if (req.body.nationalities !== undefined) {
      try {
        if (typeof req.body.nationalities === "string") {
          req.body.nationalities = JSON.parse(req.body.nationalities);
        }
        if (!Array.isArray(req.body.nationalities)) {
          req.body.nationalities = req.body.nationalities ? [req.body.nationalities] : [];
        }
        req.body.nationalities = req.body.nationalities.filter(Boolean).slice(0, 3);
      } catch (e) {
        req.body.nationalities = [];
      }
    }

    // Manejo de foto en cloudinary
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
      req.body.photo = result.secure_url;
    }

    // Relaciones (si vienen vacías las seteamos en null)
    ["scout", "sponsor", "club"].forEach(ref => {
      if (req.body[ref] === "" || req.body[ref] === "null") req.body[ref] = null;
    });

    const deportista = await Deportista.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("scout")
      .populate("sponsor")
      .populate("club");

    if (!deportista) {
      return res.status(404).json({ error: "Deportista no encontrado" });
    }

    res.json(deportista);
  } catch (err) {
    console.error("Error actualizando deportista:", err);
    res.status(400).json({ error: "Error al actualizar el perfil", details: err.message });
  }
});

// Obtener uno por ID
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