const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireSuperAdmin = require("../middleware/requireSuperAdmin");
const Deportista = require("../models/Deportista");
const Scout = require("../models/Scout");
const Sponsor = require("../models/Sponsor");
const Club = require("../models/Club");
const Admin = require("../models/Admin");
const CheckIn = require("../models/CheckIn");
const Recurso = require("../models/Recurso");
const Sesion = require("../models/Sesion");

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

// ==================== SALUD MENTAL — ADMIN ====================

// Todos los check-ins de todos los deportistas (con info básica del atleta)
router.get("/salud-mental/checkins", auth, requireSuperAdmin, async (req, res) => {
  try {
    const { deportistaId, dias } = req.query;
    const filtro = deportistaId ? { deportistaId } : {};
    const limite = parseInt(dias) || 90;
    const checkins = await CheckIn.find(filtro)
      .populate("deportistaId", "name lastName sport country city level photo")
      .sort({ fecha: -1 })
      .limit(limite * (deportistaId ? 1 : 500));
    res.json(checkins);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener check-ins" });
  }
});

// Estadísticas globales de salud mental
router.get("/salud-mental/stats", auth, requireSuperAdmin, async (req, res) => {
  try {
    const hace7 = new Date();
    hace7.setDate(hace7.getDate() - 7);
    const hace7Str = hace7.toISOString().slice(0, 10);

    const totalDeportistas = await Deportista.countDocuments();

    // Deportistas con al menos un check-in en últimos 7 días
    const activos7d = await CheckIn.distinct("deportistaId", { fecha: { $gte: hace7Str } });

    // Promedio global de puntuación
    const promedioResult = await CheckIn.aggregate([
      { $match: { fecha: { $gte: hace7Str } } },
      { $group: { _id: null, promedio: { $avg: "$puntuacionPreparacion" }, avgEstres: { $avg: "$nivelEstres" }, avgSueno: { $avg: "$calidadSueno" } } }
    ]);

    // Distribución de estrés (últimos 7 días)
    const distribucionEstres = await CheckIn.aggregate([
      { $match: { fecha: { $gte: hace7Str } } },
      {
        $group: {
          _id: null,
          bajo: { $sum: { $cond: [{ $lte: ["$nivelEstres", 3] }, 1, 0] } },
          medio: { $sum: { $cond: [{ $and: [{ $gt: ["$nivelEstres", 3] }, { $lte: ["$nivelEstres", 6] }] }, 1, 0] } },
          alto: { $sum: { $cond: [{ $gt: ["$nivelEstres", 6] }, 1, 0] } },
        }
      }
    ]);

    // Alertas: deportistas sin check-in en 3+ días
    const hace3 = new Date();
    hace3.setDate(hace3.getDate() - 3);
    const hace3Str = hace3.toISOString().slice(0, 10);
    const conCheckinReciente = await CheckIn.distinct("deportistaId", { fecha: { $gte: hace3Str } });

    // Deportistas con puntuación baja consecutiva (< 40 últimos 2 días)
    const ayer = new Date(); ayer.setDate(ayer.getDate() - 1);
    const hoy = new Date().toISOString().slice(0, 10);
    const ayerStr = ayer.toISOString().slice(0, 10);
    const bajosPuntaje = await CheckIn.aggregate([
      { $match: { fecha: { $in: [hoy, ayerStr] }, puntuacionPreparacion: { $lt: 40 } } },
      { $group: { _id: "$deportistaId", count: { $sum: 1 } } },
      { $match: { count: { $gte: 2 } } }
    ]);

    res.json({
      totalDeportistas,
      activosUltimos7Dias: activos7d.length,
      tasaUso7d: totalDeportistas > 0 ? Math.round((activos7d.length / totalDeportistas) * 100) : 0,
      promedioGlobal: promedioResult[0] ? Math.round(promedioResult[0].promedio) : null,
      promedioEstres: promedioResult[0] ? Math.round(promedioResult[0].avgEstres * 10) / 10 : null,
      promedioSueno: promedioResult[0] ? Math.round(promedioResult[0].avgSueno * 10) / 10 : null,
      distribucionEstres: distribucionEstres[0] || { bajo: 0, medio: 0, alto: 0 },
      alertasSinCheckin: totalDeportistas - conCheckinReciente.length,
      alertasPuntajeBajo: bajosPuntaje.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al calcular estadísticas" });
  }
});

// Check-ins de un deportista específico (para vista de detalle del admin)
router.get("/salud-mental/deportista/:id", auth, requireSuperAdmin, async (req, res) => {
  try {
    const checkins = await CheckIn.find({ deportistaId: req.params.id }).sort({ fecha: -1 }).limit(60);
    const sesiones = await Sesion.find({ deportistaId: req.params.id }).sort({ fechaSolicitada: -1 });
    res.json({ checkins, sesiones });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener datos del deportista" });
  }
});

// Todas las sesiones para el admin
router.get("/salud-mental/sesiones", auth, requireSuperAdmin, async (req, res) => {
  try {
    const sesiones = await Sesion.find()
      .populate("deportistaId", "name lastName sport photo")
      .sort({ creadoEn: -1 });
    res.json(sesiones);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sesiones" });
  }
});

// Gestión de recursos desde el admin
router.get("/salud-mental/recursos", auth, requireSuperAdmin, async (req, res) => {
  try {
    const recursos = await Recurso.find().sort({ creadoEn: -1 });
    res.json(recursos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener recursos" });
  }
});

module.exports = router;