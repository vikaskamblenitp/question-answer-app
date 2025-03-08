import { Router } from "express";
import qaRoutes from "./modules/qa/routes";
import authRoutes from "./modules/auth/routes";
import documentsRoutes from "./modules/documents/router";

const router = Router();

router.use("/qa", qaRoutes);
router.use("/auth", authRoutes);
router.use("/documents", documentsRoutes);

export default router;