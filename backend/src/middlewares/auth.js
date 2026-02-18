import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const payload = verifyToken(token);
    if (roles.length && !roles.includes(payload.rol)) {
      return res.status(403).json({ message: "Sin permisos" });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
