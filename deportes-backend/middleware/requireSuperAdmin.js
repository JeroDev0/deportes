module.exports = function (req, res, next) {
  // Verificar que el usuario esté autenticado
  if (!req.user) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Verificar que sea admin
  if (req.modelType !== "admin") {
    return res.status(403).json({ error: "Acceso denegado: Solo administradores" });
  }

  next();
};