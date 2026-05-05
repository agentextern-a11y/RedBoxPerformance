import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ecuMapsTable = pgTable("ecu_maps", {
  id: serial("id").primaryKey(),
  vin: text("vin").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  calId: text("cal_id").notNull(),
  description: text("description"),
  checksumHex: text("checksum_hex"),
  sizeBytes: integer("size_bytes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEcuMapSchema = createInsertSchema(ecuMapsTable).omit({ id: true, createdAt: true });
export type InsertEcuMap = z.infer<typeof insertEcuMapSchema>;
export type EcuMap = typeof ecuMapsTable.$inferSelect;
