import { Router } from "express";
import { db, diagnosticsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AnalyzeDtcBody, ListDiagnosticsQueryParams } from "@workspace/api-zod";

const DTC_KNOWLEDGE: Record<string, {
  description: string;
  severity: string;
  rootCauses: string[];
  repairSteps: string[];
  costMin: number;
  costMax: number;
}> = {
  "P0300": {
    description: "Random/Multiple Cylinder Misfire Detected",
    severity: "high",
    rootCauses: [
      "Worn or fouled spark plugs",
      "Failing ignition coils",
      "Vacuum leak causing lean misfire",
      "Low fuel pressure or injector fault",
    ],
    repairSteps: [
      "Check and replace spark plugs if worn",
      "Test ignition coils with a swap test",
      "Inspect vacuum hoses for cracks",
      "Check fuel pressure with a gauge",
      "Scan live data for misfire counts per cylinder",
    ],
    costMin: 80,
    costMax: 450,
  },
  "P0171": {
    description: "System Too Lean (Bank 1)",
    severity: "medium",
    rootCauses: [
      "Dirty or faulty MAF sensor",
      "Vacuum leak downstream of MAF",
      "Weak fuel pump or clogged fuel filter",
      "Faulty oxygen sensor reading incorrectly",
    ],
    repairSteps: [
      "Clean MAF sensor with MAF cleaner spray",
      "Smoke test intake system for vacuum leaks",
      "Check fuel pressure at idle and under load",
      "Inspect upstream O2 sensor voltage (should oscillate 0.1-0.9V)",
    ],
    costMin: 50,
    costMax: 320,
  },
  "P0420": {
    description: "Catalyst System Efficiency Below Threshold (Bank 1)",
    severity: "medium",
    rootCauses: [
      "Worn catalytic converter (most common)",
      "Engine oil burning contaminating catalyst",
      "Coolant leak into exhaust from head gasket",
      "Faulty downstream oxygen sensor",
    ],
    repairSteps: [
      "Confirm with live O2 sensor waveform analysis",
      "Check for oil burning or coolant loss",
      "Test downstream O2 sensor — replace if sluggish",
      "Replace catalytic converter if confirmed faulty",
    ],
    costMin: 200,
    costMax: 1200,
  },
  "P0442": {
    description: "EVAP System Small Leak Detected",
    severity: "low",
    rootCauses: [
      "Loose or damaged fuel cap",
      "Cracked EVAP hose or purge valve",
      "Faulty vent valve or canister",
    ],
    repairSteps: [
      "Tighten or replace fuel cap",
      "Inspect EVAP lines and connections visually",
      "Smoke test EVAP system for leak location",
      "Replace defective valve if found",
    ],
    costMin: 20,
    costMax: 250,
  },
};

function analyzeDtc(dtcCode: string) {
  const upper = dtcCode.toUpperCase();
  const known = DTC_KNOWLEDGE[upper];
  if (known) return { ...known, dtcCode: upper };
  return {
    dtcCode: upper,
    description: `Fault code ${upper} detected. Refer to vehicle-specific service manual for detailed diagnosis.`,
    severity: "medium",
    rootCauses: [
      "Sensor fault or circuit issue",
      "Mechanical component failure",
      "Software or calibration anomaly",
    ],
    repairSteps: [
      "Record freeze frame data for context",
      "Inspect wiring harness and connectors related to the fault",
      "Test sensor values against factory specifications",
      "Clear code and verify if it returns after a drive cycle",
    ],
    costMin: 50,
    costMax: 500,
  };
}

const router = Router();

router.get("/diagnostics", async (req, res) => {
  const parsed = ListDiagnosticsQueryParams.safeParse(req.query);
  const vehicleId = parsed.success && parsed.data.vehicleId ? parsed.data.vehicleId : undefined;

  const query = db.select().from(diagnosticsTable);
  const diagnostics = vehicleId
    ? await query.where(eq(diagnosticsTable.vehicleId, vehicleId)).orderBy(diagnosticsTable.createdAt)
    : await query.orderBy(diagnosticsTable.createdAt);

  res.json(diagnostics);
});

router.post("/diagnostics/analyze", async (req, res) => {
  const parsed = AnalyzeDtcBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error });
    return;
  }
  const { dtcCode, vehicleId } = parsed.data;
  const analysis = analyzeDtc(dtcCode);

  const [diagnostic] = await db
    .insert(diagnosticsTable)
    .values({
      vehicleId: vehicleId ?? null,
      dtcCode: analysis.dtcCode,
      severity: analysis.severity,
      description: analysis.description,
      rootCauses: analysis.rootCauses,
      repairSteps: analysis.repairSteps,
      estimatedCostMin: analysis.costMin,
      estimatedCostMax: analysis.costMax,
    })
    .returning();

  res.json(diagnostic);
});

export default router;
