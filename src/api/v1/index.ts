import { Router } from "express";
import qaRoutes from "./modules/qa/routes";
import documentsRoutes from "./modules/documents/router";

const router = Router();

router.use(qaRoutes);
router.use(documentsRoutes);

export default router;