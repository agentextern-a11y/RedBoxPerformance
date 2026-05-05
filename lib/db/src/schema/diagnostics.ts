import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { vehiclesTable } from "./vehicles";

export const diagnosticsTable = pgTable("diagnostics", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehiclesTable.id, { onDelete: "set null" }),
  dtcCode: text("dtc_code").notNull(),
  severity: text("severity").notNull().default("medium"),
  description: text("description").notNull(),
  rootCauses: text("root_causes").array().notNull().default([]),
  repairSteps: text("repair_steps").array().notNull().default([]),
  estimatedCostMin: integer("estimated_cost_min"),
  estimatedCostMax: integer("estimated_cost_max"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDiagnosticSchema = createInsertSchema(diagnosticsTable).omit({ id: true, createdAt: true });
export type InsertDiagnostic = z.infer<typeof insertDiagnosticSchema>;
export type Diagnostic = typeof diagnosticsTable.$inferSelect;
