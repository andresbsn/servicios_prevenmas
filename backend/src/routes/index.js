import { Router } from "express";
import authRoutes from "./authRoutes.js";
import clientRoutes from "./clientRoutes.js";
import catalogRoutes from "./catalogRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import jobRoutes from "./jobRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clientes", clientRoutes);
router.use("/catalogo", catalogRoutes);
router.use("/servicios", serviceRoutes);
router.use("/facturas", invoiceRoutes);
router.use("/jobs", jobRoutes);

export default router;
