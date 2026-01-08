// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Deportista = require("../models/Deportista");
const Scout = require("../models/Scout");
const Sponsor = require("../models/Sponsor");
const Club = require("../models/Club");

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password, profileType } = req.body;

    console.log("Registro de usuario:", { email, profileType }); // Para debug

    // Validar que todos los campos requeridos estén presentes
    if (!email || !password || !profileType) {
      return res.status(400).json({ 
        error: "Todos los campos son requeridos",
        details: "Email, password y profileType son obligatorios" 
      });
    }

    // Comprobar si el email ya existe en cualquier colección
    let existingUser = await Deportista.findOne({ email });
    if (!existingUser) existingUser = await Scout.findOne({ email });
    if (!existingUser) existingUser = await Sponsor.findOne({ email });
    if (!existingUser) existingUser = await Club.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    let newUser;
    // Crear usuario según su tipo
    switch (profileType) {
      case "atleta":
        console.log("Creando usuario deportista");
        newUser = new Deportista({
          email,
          password: hashedPassword,
          profileType: "atleta"
        });
        break;
      case "scout":
        console.log("Creando usuario scout");
        newUser = new Scout({
          email,
          password: hashedPassword,
          profileType: "scout" // Aseguramos que tenga este campo
        });
        break;
      case "sponsor":
        console.log("Creando usuario sponsor");
        newUser = new Sponsor({
          email,
          password: hashedPassword,
          profileType: "sponsor"
        });
        break;
      case "club":
        console.log("Creando usuario club");
        newUser = new Club({
          email,
          password: hashedPassword,
          profileType: "club"
        });
        break;
      default:
        return res.status(400).json({ error: "Tipo de perfil no válido" });
    }

    await newUser.save();
    console.log(`Usuario ${profileType} registrado correctamente`);
    res.status(201).json({ 
      message: "Usuario registrado correctamente",
      profileType: profileType 
    });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ 
      error: "Error al registrar usuario", 
      details: err.message 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Todos los campos son requeridos",
        details: "Email y password son obligatorios" 
      });
    }

    // Buscar usuario en todas las colecciones
    let user = await Deportista.findOne({ email });
    let modelType = "deportista";

    if (!user) {
      user = await Scout.findOne({ email });
      if (user) modelType = "scout";
    }

    if (!user) {
      user = await Sponsor.findOne({ email });
      if (user) modelType = "sponsor";
    }

    if (!user) {
      user = await Club.findOne({ email });
      if (user) modelType = "club";
    }

    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // Generar JWT
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        modelType: modelType
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) throw err;
        // Enviar token y datos básicos del usuario
        console.log(`Usuario ${modelType} ha iniciado sesión`);
        res.json({
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name || "",
            lastName: user.lastName || "",
            photo: user.photo || "",
            modelType: modelType
          }
        });
      }
    );
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ 
      error: "Error en el servidor", 
      details: err.message 
    });
  }
});

module.exports = router;