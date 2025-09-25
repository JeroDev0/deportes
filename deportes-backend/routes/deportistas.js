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
    console.log("📥 Datos recibidos en el backend:", req.body);
    console.log("📥 Tipo de content-type:", req.headers["content-type"]);

    // 🔥 SOLUCIÓN MEJORADA: Procesar campos string problemáticos
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

    console.log("📋 Campos string después del procesamiento:", {
      postalCode: `"${req.body.postalCode}" (${typeof req.body.postalCode})`,
      address: `"${req.body.address}" (${typeof req.body.address})`,
      birthCountry: `"${req.body.birthCountry}" (${typeof req.body.birthCountry})`,
      birthCity: `"${req.body.birthCity}" (${typeof req.body.birthCity})`,
      shortDescription: `"${req.body.shortDescription}" (${typeof req.body.shortDescription})`
    });

    // Normalizar age a número
    if (req.body.age) req.body.age = parseInt(req.body.age, 10);

    // Normalizar arrays
    ["experience", "recognitions", "skills", "certifications"].forEach((field) => {
      if (req.body[field] && !Array.isArray(req.body[field])) {
        req.body[field] = [req.body[field]];
      }
    });

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

    console.log("📤 Datos finales para actualizar:", req.body);

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

    console.log("✅ Deportista actualizado correctamente");
    res.json(deportista);
  } catch (err) {
    console.error("❌ Error actualizando deportista:", err);
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