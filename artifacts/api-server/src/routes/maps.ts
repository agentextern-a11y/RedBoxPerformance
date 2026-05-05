import { Router } from "express";
import { db, ecuMapsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateMapBody, GetMapParams } from "@workspace/api-zod";

const router = Router();

router.get("/maps", async (req, res) => {
  const maps = await db.select().from(ecuMapsTable).orderBy(ecuMapsTable.createdAt);
  res.json(maps);
});

router.post("/maps", async (req, res) => {
  const parsed = CreateMapBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error });
    return;
  }
  const [map] = await db.insert(ecuMapsTable).values(parsed.data).returning();
  res.status(201).json(map);
});

router.get("/maps/:id", async (req, res) => {
  const parsed = GetMapParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [map] = await db.select().from(ecuMapsTable).where(eq(ecuMapsTable.id, parsed.data.id));
  if (!map) {
    res.status(404).json({ error: "Map not found" });
    return;
  }
  res.json(map);
});

export default router;
