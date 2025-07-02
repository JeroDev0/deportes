const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Deportista = require("../models/Deportista");

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password, profileType } = req.body;

    // Verifica si el usuario ya existe
    const userExists = await Deportista.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "El email ya está registrado" });

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determina si el usuario debe ser aprobado automáticamente
    let isApproved = false;
    if (profileType === "atleta") isApproved = true;

    // Crea el usuario
    const newUser = new Deportista({
      email,
      password: hashedPassword,
      profileType,
      isApproved,
    });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al registrar usuario", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Deportista.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Contraseña incorrecta" });

    // Genera un token (puedes personalizar el payload)
    const token = jwt.sign(
      { id: user._id, email: user.email, profileType: user.profileType },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        profileType: user.profileType,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al iniciar sesión", details: err.message });
  }
});

module.exports = router;
