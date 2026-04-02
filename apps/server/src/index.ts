import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import express from "express";
import cors from "cors";
import http from "http";
import { StudyRoom } from "./rooms/StudyRoom.js";

const PORT = Number(process.env.PORT ?? 2567);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";

async function bootstrap() {
  const app = express();

  app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = http.createServer(app);

  const gameServer = new Server({
    transport: new WebSocketTransport({ server: httpServer }),
  });

  gameServer.define("study_room", StudyRoom);

  // Colyseus monitor dashboard at /colyseus
  app.use("/colyseus", monitor());

  await gameServer.listen(PORT);
  console.log(`🚀 StudyVerse server listening on ws://localhost:${PORT}`);
  console.log(`📊 Colyseus monitor: http://localhost:${PORT}/colyseus`);
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
