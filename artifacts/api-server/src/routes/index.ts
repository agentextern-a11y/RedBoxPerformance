import { Router, type IRouter } from "express";
import healthRouter from "./health";
import vehiclesRouter from "./vehicles";
import sessionsRouter from "./sessions";
import diagnosticsRouter from "./diagnostics";
import predictionsRouter from "./predictions";
import mapsRouter from "./maps";
import liveMetricsRouter from "./liveMetrics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(vehiclesRouter);
router.use(sessionsRouter);
router.use(diagnosticsRouter);
router.use(predictionsRouter);
router.use(mapsRouter);
router.use(liveMetricsRouter);

export default router;
