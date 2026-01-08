require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.1.6:5173",
      'https://deportes-directory.netlify.app'
    ],
    credentials: true,
  })
);
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB LOCAL"))
  .catch((err) => console.error("❌ Error de conexión:", err));

const deportistasRoutes = require("./routes/deportistas");
app.use("/deportistas", deportistasRoutes);

const publicacionesRoutes = require("./routes/publicaciones");
app.use("/publicaciones", publicacionesRoutes);

const scoutsRoutes = require("./routes/scouts");
app.use("/scouts", scoutsRoutes);

const sponsorsRoutes = require("./routes/sponsors");
app.use("/sponsors", sponsorsRoutes);

const clubsRoutes = require("./routes/clubs");
app.use("/clubs", clubsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Modo: LOCAL`);
});