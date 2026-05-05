import { pgTable, serial, text, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { vehiclesTable } from "./vehicles";

export const predictionsTable = pgTable("predictions", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehiclesTable.id, { onDelete: "cascade" }),
  component: text("component").notNull(),
  status: text("status").notNull().default("good"),
  kmUntilService: integer("km_until_service").notNull().default(10000),
  confidence: real("confidence").notNull().default(0.85),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictionsTable).omit({ id: true, lastCheckedAt: true });
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictionsTable.$inferSelect;
