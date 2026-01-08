const express = require("express");
const router = express.Router();
const Scout = require("../models/Scout");
const Deportista = require("../models/Deportista");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer();

router.get("/", async (req, res) => {
  try {
    const scouts = await Scout.find()
      .populate("athletes", "name lastName photo")
      .populate("clubs", "name city")
      .populate("sponsors", "name companyName");
    res.json(scouts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los scouts" });
  }
});

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const scoutData = {...req.body};
    
    ['experience', 'certifications', 'recognitions', 'sports'].forEach(field => {
      if (req.body[field]) {
        scoutData[field] = Array.isArray(req.body[field]) ? req.body[field] : [req.body[field]];
      }
    });

    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "scouts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file.buffer);
      scoutData.photo = result.secure_url;
    }

    const nuevoScout = new Scout(scoutData);
    await nuevoScout.save();
    res.status(201).json(nuevoScout);
  } catch (err) {
    res.status(400).json({
      error: "Error al registrar el scout",
      details: err.message,
    });
  }
});

// RUTA PUT CORREGIDA
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    console.log("=== INICIO UPDATE SCOUT ===");
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file ? "Sí" : "No");

    const scoutData = {};

    // Campos de texto simples
    const stringFields = [
      'name', 'lastName', 'gender', 'phone', 'company', 'specialization',
      'country', 'city', 'postalCode', 'address', 'birthCountry', 'birthCity',
      'about', 'shortDescription'
    ];

    stringFields.forEach(field => {
      if (req.body[field] !== undefined) {
        const value = req.body[field];
        scoutData[field] = (value === null || value === 'null' || value === 'undefined' || value === '') 
          ? '' 
          : String(value).trim();
      }
    });

    // Campo age (número)
    if (req.body.age !== undefined && req.body.age !== '') {
      scoutData.age = parseInt(req.body.age, 10);
    }

    // Procesar arrays: sports, experience, certifications, recognitions
    ['sports', 'experience', 'certifications', 'recognitions'].forEach(field => {
      if (req.body[field]) {
        let arrayValue;
        
        // Si es un array, usarlo directamente
        if (Array.isArray(req.body[field])) {
          arrayValue = req.body[field];
        } 
        // Si es un string, intentar parsearlo o convertirlo a array
        else if (typeof req.body[field] === 'string') {
          try {
            arrayValue = JSON.parse(req.body[field]);
          } catch {
            arrayValue = [req.body[field]];
          }
        } else {
          arrayValue = [req.body[field]];
        }
        
        // Filtrar valores vacíos
        scoutData[field] = arrayValue.filter(item => 
          item !== null && 
          item !== undefined && 
          item !== '' && 
          item !== 'null' && 
          item !== 'undefined'
        );

        console.log(`Array ${field}:`, scoutData[field]);
      }
    });

    // Procesar relaciones: athletes, clubs, sponsors
    ['athletes', 'clubs', 'sponsors'].forEach(field => {
      if (req.body[field]) {
        let arrayValue;
        
        if (Array.isArray(req.body[field])) {
          arrayValue = req.body[field];
        } else if (typeof req.body[field] === 'string') {
          try {
            arrayValue = JSON.parse(req.body[field]);
          } catch {
            arrayValue = req.body[field].includes(',') 
              ? req.body[field].split(',') 
              : [req.body[field]];
          }
        } else {
          arrayValue = [req.body[field]];
        }
        
        scoutData[field] = arrayValue.filter(item => 
          item !== null && 
          item !== undefined && 
          item !== '' && 
          item !== 'null' && 
          item !== 'undefined'
        );

        console.log(`Relación ${field}:`, scoutData[field]);
      }
    });

    // Subir foto si existe
    if (req.file) {
      console.log("Subiendo foto a Cloudinary...");
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "scouts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file.buffer);
      scoutData.photo = result.secure_url;
      console.log("Foto subida exitosamente:", scoutData.photo);
    }

    console.log("Datos a actualizar:", scoutData);

    // Actualizar en la base de datos
    const scout = await Scout.findByIdAndUpdate(
      req.params.id,
      { $set: scoutData },
      { new: true, runValidators: true }
    )
      .populate("athletes", "name lastName photo")
      .populate("clubs", "name city")
      .populate("sponsors", "name companyName");

    if (!scout) {
      console.log("Scout no encontrado");
      return res.status(404).json({ error: "Scout no encontrado" });
    }

    console.log("Scout actualizado exitosamente");
    console.log("=== FIN UPDATE SCOUT ===");
    res.json(scout);
  } catch (err) {
    console.error("Error actualizando scout:", err);
    res.status(400).json({ 
      error: "Error al actualizar el perfil", 
      details: err.message 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const scout = await Scout.findById(req.params.id, "-password")
      .populate("athletes", "name lastName photo")
      .populate("clubs", "name city")
      .populate("sponsors", "name companyName");
    
    if (!scout) return res.status(404).json({ error: "Scout no encontrado" });
    res.json(scout);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el scout" });
  }
});

router.post("/:scoutId/athletes/:athleteId", async (req, res) => {
  try {
    const scout = await Scout.findById(req.params.scoutId);
    if (!scout) return res.status(404).json({ error: "Scout no encontrado" });
    
    const atleta = await Deportista.findById(req.params.athleteId);
    if (!atleta) return res.status(404).json({ error: "Atleta no encontrado" });
    
    if (!scout.athletes.includes(req.params.athleteId)) {
      scout.athletes.push(req.params.athleteId);
      await scout.save();
      
      atleta.scout = req.params.scoutId;
      await atleta.save();
    }
    
    res.json(scout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:scoutId/athletes/:athleteId", async (req, res) => {
  try {
    const scout = await Scout.findById(req.params.scoutId);
    if (!scout) return res.status(404).json({ error: "Scout no encontrado" });
    
    scout.athletes = scout.athletes.filter(
      athlete => athlete.toString() !== req.params.athleteId
    );
    await scout.save();
    
    const atleta = await Deportista.findById(req.params.athleteId);
    if (atleta && atleta.scout && atleta.scout.toString() === req.params.scoutId) {
      atleta.scout = null;
      await atleta.save();
    }
    
    res.json(scout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;