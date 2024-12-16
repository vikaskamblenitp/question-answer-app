import { Router } from "express";
import v1Routes from "./v1";
import { routeNotFound } from "#middlewares";

const router = Router();

router.use("/v1", v1Routes);
router.use(routeNotFound);

export default router;