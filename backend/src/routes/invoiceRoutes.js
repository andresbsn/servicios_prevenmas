import { Router } from "express";
import { invoiceController } from "../controllers/invoiceController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth(), invoiceController.list);
router.post("/", requireAuth(["admin", "operador"]), invoiceController.create);
router.put("/:id", requireAuth(["admin", "operador"]), invoiceController.update);
router.delete("/:id", requireAuth(["admin"]), invoiceController.remove);

export default router;
