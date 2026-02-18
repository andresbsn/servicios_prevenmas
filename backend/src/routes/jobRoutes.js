import { Router } from "express";
import { jobController } from "../controllers/jobController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/expiry-notify", requireAuth(["admin"]), jobController.run);
router.get("/logs", requireAuth(["admin"]), jobController.logs);

export default router;
