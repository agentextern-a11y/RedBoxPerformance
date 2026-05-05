import { Router } from "express";
import { db, sessionsTable } from "@workspace/db";
import { eq, avg, sum, count } from "drizzle-orm";
import { CreateSessionBody, GetSessionParams, ListSessionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/sessions", async (req, res) => {
  const parsed = ListSessionsQueryParams.safeParse(req.query);
  const vehicleId = parsed.success && parsed.data.vehicleId ? parsed.data.vehicleId : undefined;

  const query = db.select().from(sessionsTable);
  const sessions = vehicleId
    ? await query.where(eq(sessionsTable.vehicleId, vehicleId)).orderBy(sessionsTable.startedAt)
    : await query.orderBy(sessionsTable.startedAt);

  res.json(sessions);
});

router.post("/sessions", async (req, res) => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error });
    return;
  }
  const [session] = await db.insert(sessionsTable).values(parsed.data).returning();
  res.status(201).json(session);
});

router.get("/sessions/summary", async (req, res) => {
  const [stats] = await db
    .select({
      totalSessions: count(),
      avgHealthScore: avg(sessionsTable.avgHealthScore),
      totalDistanceKm: sum(sessionsTable.distanceKm),
    })
    .from(sessionsTable);

  const anomalyRows = await db
    .select({ cnt: count() })
    .from(sessionsTable)
    .where(eq(sessionsTable.anomalyDetected, true));

  const recentSessions = await db
    .select()
    .from(sessionsTable)
    .orderBy(sessionsTable.startedAt)
    .limit(5);

  res.json({
    totalSessions: Number(stats?.totalSessions ?? 0),
    avgHealthScore: Number(stats?.avgHealthScore ?? 0),
    totalDistanceKm: Number(stats?.totalDistanceKm ?? 0),
    anomalyCount: Number(anomalyRows[0]?.cnt ?? 0),
    recentSessions,
  });
});

router.get("/sessions/:id", async (req, res) => {
  const parsed = GetSessionParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, parsed.data.id));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json(session);
});

export default router;
