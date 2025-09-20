require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ============================
// Middlewares
// ============================
app.use(
  cors({
    origin: [
      "https://deportes-directory.netlify.app",
      "http://localhost:5173",
      "http://192.168.1.6:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// ============================
// Rutas de autenticación
// ============================
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// ============================
// Conexión a MongoDB
// ============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// ============================
// Rutas principales
// ============================

// Rutas de deportistas
const deportistasRoutes = require("./routes/deportistas");
app.use("/deportistas", deportistasRoutes);

// Rutas de publicaciones
const publicacionesRoutes = require("./routes/publicaciones");
app.use("/publicaciones", publicacionesRoutes);

// Rutas de scouts
const scoutsRoutes = require("./routes/scouts");
app.use("/scouts", scoutsRoutes);

// Rutas de sponsors
const sponsorsRoutes = require("./routes/sponsors");
app.use("/sponsors", sponsorsRoutes);

// Rutas de clubs
const clubsRoutes = require("./routes/clubs");
app.use("/clubs", clubsRoutes);

// ============================
// Servidor
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});