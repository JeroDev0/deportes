const express = require("express");
const router = express.Router();
const Sponsor = require("../models/Sponsor");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer();

// PUT /sponsors/:id  (con upload de logo)
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    console.log("=== INICIO UPDATE SPONSOR ===");
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file ? "Sí" : "No");

    const sponsorData = {};

    // Campos string
    const stringFields = [
      "name",
      "company",
      "industry",
      "country",
      "city",
      "about",
      "shortDescription",
      "phone",
    ];

    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const value = req.body[field];
        sponsorData[field] =
          value === null || value === "null" || value === "undefined"
            ? ""
            : String(value).trim();
      }
    });

    // Arrays
    ["sports", "categories", "countries"].forEach((field) => {
      if (req.body[field] !== undefined) {
        let arr;
        if (Array.isArray(req.body[field])) arr = req.body[field];
        else if (typeof req.body[field] === "string") {
          try {
            arr = JSON.parse(req.body[field]);
          } catch {
            arr = req.body[field].includes(",")
              ? req.body[field].split(",")
              : [req.body[field]];
          }
        } else arr = [req.body[field]];

        sponsorData[field] = arr.filter(
          (x) => x && x !== "null" && x !== "undefined"
        );
      }
    });

    // Relaciones
    ["athletes", "clubs", "scouts"].forEach((field) => {
      if (req.body[field] !== undefined) {
        let arr;
        if (Array.isArray(req.body[field])) arr = req.body[field];
        else if (typeof req.body[field] === "string") {
          try {
            arr = JSON.parse(req.body[field]);
          } catch {
            arr = req.body[field].includes(",")
              ? req.body[field].split(",")
              : [req.body[field]];
          }
        } else arr = [req.body[field]];

        sponsorData[field] = arr.filter(
          (x) => x && x !== "null" && x !== "undefined"
        );
      }
    });

    // Subir logo a Cloudinary si viene archivo
    if (req.file) {
      const streamUpload = (fileBuffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "sponsors" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });

      const result = await streamUpload(req.file.buffer);
      sponsorData.logo = result.secure_url;
      console.log("Logo subido:", sponsorData.logo);
    }

    const sponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      { $set: sponsorData },
      { new: true, runValidators: true }
    );

    if (!sponsor) return res.status(404).json({ error: "Sponsor no encontrado" });

    console.log("=== FIN UPDATE SPONSOR ===");
    res.json(sponsor);
  } catch (err) {
    console.error("Error actualizando sponsor:", err);
    res.status(400).json({
      error: "Error al actualizar sponsor",
      details: err.message,
    });
  }
});

module.exports = router;