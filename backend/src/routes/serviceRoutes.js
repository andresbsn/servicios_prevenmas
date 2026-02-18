import { Router } from "express";
import { serviceController } from "../controllers/serviceController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth(), serviceController.list);
router.get("/upcoming", requireAuth(), serviceController.listUpcoming);
router.get("/cliente/:clienteId", requireAuth(), serviceController.listByClient);
router.post("/", requireAuth(["admin", "operador"]), serviceController.create);
router.put("/:id", requireAuth(["admin", "operador"]), serviceController.update);
router.delete("/:id", requireAuth(["admin"]), serviceController.remove);

export default router;
