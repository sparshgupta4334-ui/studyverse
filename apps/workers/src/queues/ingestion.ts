import { Queue } from "bullmq";
import type { ResourceType } from "@studyverse/shared";
import { redisConnection } from "../lib/redis.js";

export const INGESTION_QUEUE_NAME = "ingestion";

export interface IngestionJobData {
  resourceId: string;
  workspaceId: string;
  type: ResourceType;
  url?: string;
  fileKey?: string;
  retryCount?: number;
}

export const ingestionQueue = new Queue<IngestionJobData>(INGESTION_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export async function enqueueIngestion(data: IngestionJobData): Promise<string> {
  const job = await ingestionQueue.add(
    `ingest:${data.type}:${data.resourceId}`,
    data,
    { jobId: `ingest-${data.resourceId}` },
  );
  return job.id ?? data.resourceId;
}
