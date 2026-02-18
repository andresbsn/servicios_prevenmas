import { Router } from "express";
import { catalogController } from "../controllers/catalogController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth(), catalogController.list);
router.get("/:id", requireAuth(), catalogController.get);
router.post("/", requireAuth(["admin", "operador"]), catalogController.create);
router.put("/:id", requireAuth(["admin", "operador"]), catalogController.update);
router.delete("/:id", requireAuth(["admin"]), catalogController.remove);

export default router;
