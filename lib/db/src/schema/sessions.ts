import { pgTable, serial, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { vehiclesTable } from "./vehicles";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehiclesTable.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  maxRpm: integer("max_rpm"),
  maxSpeedKmh: integer("max_speed_kmh"),
  avgHealthScore: real("avg_health_score"),
  distanceKm: real("distance_km"),
  anomalyDetected: boolean("anomaly_detected").notNull().default(false),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true, startedAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
