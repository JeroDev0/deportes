require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors({
  origin: 'https://deportes-directory.netlify.app',
  credentials: true
}));
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión:", err));

// Rutas de ejemplo
const deportistasRoutes = require("./routes/deportistas");
app.use("/deportistas", deportistasRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
