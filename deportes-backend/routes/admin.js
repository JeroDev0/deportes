const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireSuperAdmin = require("../middleware/requireSuperAdmin");
const Deportista = require("../models/Deportista");
const Scout = require("../models/Scout");
const Sponsor = require("../models/Sponsor");
const Club = require("../models/Club");
const Admin = require("../models/Admin");

// ==================== VER TODOS LOS USUARIOS ====================
router.get("/users", auth, requireSuperAdmin, async (req, res) => {
  try {
    const deportistas = await Deportista.find().select("+email +phone +address +postalCode");
    const scouts = await Scout.find().select("+email +phone +address");
    const sponsors = await Sponsor.find().select("+email +phone +address");
    const clubs = await Club.find().select("+email +phone +address");

    const allUsers = [
      ...deportistas.map((u) => ({ ...u.toObject(), modelType: "deportista" })),
      ...scouts.map((u) => ({ ...u.toObject(), modelType: "scout" })),
      ...sponsors.map((u) => ({ ...u.toObject(), modelType: "sponsor" })),
      ...clubs.map((u) => ({ ...u.toObject(), modelType: "club" })),
    ];

    res.json(allUsers);
  } catch (err) {
    console.error("❌ Error obteniendo usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// ==================== VER PERFIL COMPLETO (con datos privados) ====================
router.get("/users/:modelType/:id", auth, requireSuperAdmin, async (req, res) => {
  try {
    const { modelType, id } = req.params;

    let user;
    switch (modelType) {
      case "deportista":
        user = await Deportista.findById(id).select("+email +phone +address +postalCode");
        break;
      case "scout":
        user = await Scout.findById(id).select("+email +phone +address");
        break;
      case "sponsor":
        user = await Sponsor.findById(id).select("+email +phone +address");
        break;
      case "club":
        user = await Club.findById(id).select("+email +phone +address");
        break;
      default:
        return res.status(400).json({ error: "Tipo de modelo no válido" });
    }

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error obteniendo perfil:", err);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// ==================== EDITAR CUALQUIER PERFIL ====================
router.put("/users/:modelType/:id", auth, requireSuperAdmin, async (req, res) => {
  try {
    const { modelType, id } = req.params;
    const updates = req.body;

    let user;
    switch (modelType) {
      case "deportista":
        user = await Deportista.findByIdAndUpdate(id, updates, { new: true });
        break;
      case "scout":
        user = await Scout.findByIdAndUpdate(id, updates, { new: true });
        break;
      case "sponsor":
        user = await Sponsor.findByIdAndUpdate(id, updates, { new: true });
        break;
      case "club":
        user = await Club.findByIdAndUpdate(id, updates, { new: true });
        break;
      default:
        return res.status(400).json({ error: "Tipo de modelo no válido" });
    }

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil actualizado correctamente", user });
  } catch (err) {
    console.error("❌ Error actualizando perfil:", err);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

// ==================== ELIMINAR PERFIL ====================
router.delete("/users/:modelType/:id", auth, requireSuperAdmin, async (req, res) => {
  try {
    const { modelType, id } = req.params;

    let user;
    switch (modelType) {
      case "deportista":
        user = await Deportista.findByIdAndDelete(id);
        break;
      case "scout":
        user = await Scout.findByIdAndDelete(id);
        break;
      case "sponsor":
        user = await Sponsor.findByIdAndDelete(id);
        break;
      case "club":
        user = await Club.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ error: "Tipo de modelo no válido" });
    }

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error eliminando perfil:", err);
    res.status(500).json({ error: "Error al eliminar perfil" });
  }
});

module.exports = router;