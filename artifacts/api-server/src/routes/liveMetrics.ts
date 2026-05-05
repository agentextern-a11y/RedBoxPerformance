import { Router } from "express";
import { broadcast } from "../lib/wsServer";
import { z } from "zod";

const router = Router();

const LiveMetricsBody = z.object({
  rpm: z.number(),
  speed: z.number(),
  coolant: z.number(),
  intake: z.number(),
  throttle: z.number(),
});

function analyzeMetrics(data: z.infer<typeof LiveMetricsBody>) {
  const alerts: Array<{ severity: "low" | "medium" | "high" | "critical"; message: string }> = [];

  if (data.rpm > 7000) {
    alerts.push({ severity: "critical", message: `Critical RPM: ${data.rpm} — Redline risk, lift off now` });
  } else if (data.rpm > 5500) {
    alerts.push({ severity: "high", message: `High RPM: ${data.rpm} — Sustained engine stress` });
  } else if (data.rpm > 4000) {
    alerts.push({ severity: "medium", message: `Elevated RPM: ${data.rpm} — Monitor load` });
  }

  if (data.coolant > 105) {
    alerts.push({ severity: "critical", message: `Coolant: ${data.coolant}°C — Overheating! Stop engine` });
  } else if (data.coolant > 98) {
    alerts.push({ severity: "high", message: `Coolant: ${data.coolant}°C — Above normal operating temp` });
  }

  if (data.throttle > 90 && data.speed < 20) {
    alerts.push({ severity: "medium", message: "Full throttle at low speed — Check drivetrain / clutch slip" });
  }

  if (data.intake > 55) {
    alerts.push({ severity: "medium", message: `Intake temp: ${data.intake}°C — Hot air reducing power output` });
  }

  return alerts;
}

router.post("/live-metrics", async (req, res) => {
  const parsed = LiveMetricsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid metrics", details: parsed.error });
    return;
  }

  const alerts = analyzeMetrics(parsed.data);

  for (const alert of alerts) {
    broadcast({
      type: "analysis",
      severity: alert.severity,
      message: alert.message,
      data: parsed.data,
      timestamp: Date.now(),
    });
  }

  if (alerts.length === 0 && Math.random() < 0.05) {
    broadcast({
      type: "telemetry",
      severity: "low",
      message: `All sensors nominal — RPM ${parsed.data.rpm} | ${parsed.data.speed} km/h | ${parsed.data.coolant}°C`,
      timestamp: Date.now(),
    });
  }

  res.json({ ok: true, alertsGenerated: alerts.length });
});

export default router;
