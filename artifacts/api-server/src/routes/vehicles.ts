import { Router } from "express";
import { db, vehiclesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateVehicleBody, GetVehicleParams, DeleteVehicleParams } from "@workspace/api-zod";

const router = Router();

router.get("/vehicles", async (req, res) => {
  const vehicles = await db.select().from(vehiclesTable).orderBy(vehiclesTable.createdAt);
  res.json(vehicles);
});

router.post("/vehicles", async (req, res) => {
  const parsed = CreateVehicleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error });
    return;
  }
  const { vin, make, model, year, engineCode, mileageKm } = parsed.data;
  const [vehicle] = await db
    .insert(vehiclesTable)
    .values({ vin, make, model, year, engineCode, mileageKm: mileageKm ?? 0, healthScore: 100 })
    .returning();
  res.status(201).json(vehicle);
});

router.get("/vehicles/:id", async (req, res) => {
  const parsed = GetVehicleParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [vehicle] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, parsed.data.id));
  if (!vehicle) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  res.json(vehicle);
});

router.delete("/vehicles/:id", async (req, res) => {
  const parsed = DeleteVehicleParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(vehiclesTable).where(eq(vehiclesTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
