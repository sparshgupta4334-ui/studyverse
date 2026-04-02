import "dotenv/config";
import { ingestionQueue } from "./queues/ingestion.js";
import { createIngestionWorker } from "./workers/ingestionWorker.js";

async function main() {
  console.log("🚀 StudyVerse Workers starting...");

  // Health-check queue connection
  await ingestionQueue.waitUntilReady();
  console.log("✅ Ingestion queue ready");

  // Start workers
  const ingestionWorker = createIngestionWorker();
  console.log("✅ Ingestion worker started (concurrency: 3)");

  // Graceful shutdown
  const shutdown = async () => {
    console.log("\n🛑 Shutting down workers...");
    await ingestionWorker.close();
    await ingestionQueue.close();
    process.exit(0);
  };

  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());

  console.log("👂 Workers listening for jobs...");
}

main().catch((err) => {
  console.error("Fatal error starting workers:", err);
  process.exit(1);
});
