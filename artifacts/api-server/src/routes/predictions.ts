import { Router } from "express";
import { db, predictionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListPredictionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/predict", async (req, res) => {
  const parsed = ListPredictionsQueryParams.safeParse(req.query);
  if (!parsed.success || !parsed.data.vehicleId) {
    res.status(400).json({ error: "vehicleId query param is required" });
    return;
  }
  const predictions = await db
    .select()
    .from(predictionsTable)
    .where(eq(predictionsTable.vehicleId, parsed.data.vehicleId))
    .orderBy(predictionsTable.kmUntilService);
  res.json(predictions);
});

export default router;
