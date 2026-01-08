// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // Obtener token del header
  const token = req.header("x-auth-token");

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ error: "No hay token, autorización denegada" });
  }

  // Verificar token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    req.modelType = decoded.user.modelType; // Guardar el tipo de modelo
    next();
  } catch (err) {
    res.status(401).json({ error: "Token no válido" });
  }
};