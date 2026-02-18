import { loginSchema } from "../validations/authValidation.js";
import { authService } from "../services/authService.js";

export const authController = {
  async login(req, res, next) {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await authService.login(payload);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};
