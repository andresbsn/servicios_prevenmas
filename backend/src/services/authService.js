import { userRepo } from "../repositories/userRepo.js";
import { comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export const authService = {
  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }

    const token = signToken({ id: user.id, rol: user.rol, nombre: user.nombre });
    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    };
  }
};
