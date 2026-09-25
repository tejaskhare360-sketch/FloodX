import { Router, type IRouter } from "express";
import healthRouter from "./health";
import floodIntelligenceRouter from "./flood-intelligence";

const router: IRouter = Router();

router.use(healthRouter);
router.use(floodIntelligenceRouter);

export default router;
