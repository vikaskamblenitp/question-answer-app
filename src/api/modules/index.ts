import { Router } from "express";
import qaRoutes from "./qa/routes.js";

const router = Router();

router.use(qaRoutes);

export default router;