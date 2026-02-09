const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Deportista = require("../models/Deportista");
const Scout = require("../models/Scout");
const Sponsor = require("../models/Sponsor");
const Club = require("../models/Club");
const Admin = require("../models/Admin");

// ==================== REGISTRO ====================
router.post("/register", async (req, res) => {
  try {
    const { email, password, profileType } = req.body;

    console.log("📝 Registro de usuario:", { email, profileType });

    // Validar campos requeridos
    if (!email || !password || !profileType) {
      return res.status(400).json({
        error: "Todos los campos son requeridos",
        details: "Email, password y profileType son obligatorios",
      });
    }

    // Comprobar si el email ya existe en cualquier colección
    let existingUser = await Deportista.findOne({ email });
    if (!existingUser) existingUser = await Scout.findOne({ email });
    if (!existingUser) existingUser = await Sponsor.findOne({ email });
    if (!existingUser) existingUser = await Club.findOne({ email });
    if (!existingUser) existingUser = await Admin.findOne({ email });

    if (existingUser) {
      console.log("❌ Email ya registrado:", email);
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    let newUser;

    // Crear usuario según su tipo
    switch (profileType) {
      case "atleta":
        console.log("✅ Creando deportista");
        newUser = new Deportista({
          email,
          password: hashedPassword,
          profileType: "atleta",
        });
        break;

      case "scout":
        console.log("✅ Creando scout");
        newUser = new Scout({
          email,
          password: hashedPassword,
          profileType: "scout",
        });
        break;

      case "sponsor":
        console.log("✅ Creando sponsor");
        newUser = new Sponsor({
          email,
          password: hashedPassword,
          profileType: "sponsor",
          company: "Company Name",
        });
        break;

      case "club":
        console.log("✅ Creando club");
        newUser = new Club({
          email,
          password: hashedPassword,
          profileType: "club",
        });
        break;

      case "admin":
        console.log("✅ Creando admin");
        newUser = new Admin({
          email,
          password: hashedPassword,
          profileType: "admin",
          role: "super_admin",
          name: "Super Admin"
        });
        break;

      default:
        return res.status(400).json({ error: "Tipo de perfil no válido" });
    }

    await newUser.save();
    console.log(`✅ Usuario ${profileType} registrado correctamente`);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      profileType: profileType,
    });
  } catch (err) {
    console.error("❌ Error en registro:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Error de validación",
        details: Object.values(err.errors).map((e) => e.message),
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Email duplicado",
        details: "Este email ya está registrado",
      });
    }

    res.status(500).json({
      error: "Error al registrar usuario",
      details: err.message,
    });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Intento de login:", email);

    if (!email || !password) {
      return res.status(400).json({
        error: "Todos los campos son requeridos",
        details: "Email y password son obligatorios",
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
      user = await Admin.findOne({ email });
      if (user) modelType = "admin";
    }

    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch) {
      console.log("❌ Contraseña incorrecta para:", email);
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // Generar JWT
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        modelType: modelType,
        role: user.role || null,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log(`✅ Login exitoso: ${modelType} - ${email}`);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || "",
        lastName: user.lastName || "",
        photo: user.photo || user.logo || "",
        modelType: modelType,
        role: user.role || null,
      },
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({
      error: "Error en el servidor",
      details: err.message,
    });
  }
});

module.exports = router;