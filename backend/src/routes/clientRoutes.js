import { Router } from "express";
import { clientController } from "../controllers/clientController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth(), clientController.list);
router.get("/:id", requireAuth(), clientController.get);
router.post("/", requireAuth(["admin", "operador"]), clientController.create);
router.put("/:id", requireAuth(["admin", "operador"]), clientController.update);
router.delete("/:id", requireAuth(["admin"]), clientController.remove);

export default router;
