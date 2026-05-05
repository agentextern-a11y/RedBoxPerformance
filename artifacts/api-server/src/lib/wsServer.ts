import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { logger } from "./logger";

export interface WSEvent {
  type: "anomaly" | "alert" | "session_saved" | "telemetry" | "analysis";
  severity?: "low" | "medium" | "high" | "critical";
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

let wss: WebSocketServer | null = null;

export function initWsServer(server: Server): void {
  wss = new WebSocketServer({ server, path: "/api/ws" });

  wss.on("connection", (ws: WebSocket) => {
    logger.info("WebSocket client connected");

    ws.send(
      JSON.stringify({
        type: "alert",
        severity: "low",
        message: "Connected to NeuronDrive live feed — all systems nominal",
        timestamp: Date.now(),
      } satisfies WSEvent),
    );

    ws.on("error", (err) => {
      logger.warn({ err }, "WebSocket client error");
    });

    ws.on("close", () => {
      logger.info("WebSocket client disconnected");
    });
  });

  logger.info("WebSocket server initialized on /api/ws");
}

export function broadcast(event: WSEvent): void {
  if (!wss) return;
  const payload = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

export function getConnectedClients(): number {
  return wss?.clients.size ?? 0;
}
