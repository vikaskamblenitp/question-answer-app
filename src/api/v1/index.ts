import { Router } from "express";
import qaRoutes from "./modules/qa/routes";
import userRoutes from "./modules/users/routes";
import documentsRoutes from "./modules/documents/router";

const router = Router();

router.use("/qa", qaRoutes);
router.use("/users", userRoutes);
router.use(documentsRoutes);

export default router;