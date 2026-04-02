import { Worker, type Job } from "bullmq";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { redisConnection } from "../lib/redis.js";
import { INGESTION_QUEUE_NAME, type IngestionJobData } from "../queues/ingestion.js";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

// ─── Text Chunking ────────────────────────────────────────────────────────────

function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

// ─── Text Extraction ──────────────────────────────────────────────────────────

async function extractText(data: IngestionJobData): Promise<string> {
  switch (data.type) {
    case "pdf": {
      if (!data.fileKey && !data.url) {
        return "PDF file not available for extraction.";
      }
      // In production: download from S3 using data.fileKey, then use pdf-parse
      // For now return placeholder text that simulates a real document
      return `[PDF Content from ${data.fileKey ?? data.url}]\n\nThis document contains study material about advanced topics in computer science, machine learning, and distributed systems. The content covers theoretical foundations and practical applications relevant to modern software engineering.\n\nSection 1: Introduction\nThis section provides an overview of the key concepts covered in this resource.\n\nSection 2: Core Concepts\nDetailed exploration of fundamental principles and methodologies.\n\nSection 3: Applications\nReal-world applications and case studies demonstrating practical usage.`;
    }
    case "link": {
      if (!data.url) return "URL not provided.";
      // In production: use puppeteer/cheerio to scrape the URL
      return `[Web Content from ${data.url}]\n\nThis web resource contains valuable information about the requested topic. The content has been extracted and processed for semantic search and AI-assisted learning.`;
    }
    case "text": {
      // Text content would be stored directly in the resource record
      const resource = await prisma.resource.findUnique({
        where: { id: data.resourceId },
        select: { url: true },
      });
      return resource?.url ?? "Text content not available.";
    }
    default:
      return `[${data.type.toUpperCase()} resource] Content extraction not yet supported for this type.`;
  }
}

// ─── Embedding ────────────────────────────────────────────────────────────────

async function createEmbeddings(texts: string[]): Promise<number[][]> {
  if (!process.env.OPENAI_API_KEY) {
    // Return mock embeddings for development
    return texts.map(() => Array.from({ length: 1536 }, () => Math.random() * 2 - 1));
  }

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: texts,
  });

  return response.data.map((d) => d.embedding);
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export function createIngestionWorker(): Worker<IngestionJobData> {
  const worker = new Worker<IngestionJobData>(
    INGESTION_QUEUE_NAME,
    async (job: Job<IngestionJobData>) => {
      const { resourceId, workspaceId } = job.data;
      console.log(`[Worker] Processing job ${job.id}: resourceId=${resourceId}`);

      // 1. Mark as processing
      await prisma.resource.update({
        where: { id: resourceId },
        data: { status: "processing" },
      });

      await job.updateProgress(10);

      // 2. Extract text
      const rawText = await extractText(job.data);
      await job.updateProgress(30);

      // 3. Chunk text
      const chunks = chunkText(rawText);
      console.log(`[Worker] Created ${chunks.length} chunks for resource ${resourceId}`);
      await job.updateProgress(50);

      // 4. Generate embeddings in batches
      const BATCH_SIZE = 20;
      const allEmbeddings: number[][] = [];
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const embeddings = await createEmbeddings(batch);
        allEmbeddings.push(...embeddings);
      }
      await job.updateProgress(80);

      // 5. Delete old chunks and insert new ones
      await prisma.resourceChunk.deleteMany({ where: { resourceId } });

      // Batch insert chunks (without embeddings via raw query for vector type)
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = allEmbeddings[i];
        if (!chunk) continue;

        await prisma.resourceChunk.create({
          data: {
            resourceId,
            content: chunk,
            chunkIndex: i,
            // embedding is stored via raw SQL in production with pgvector
          },
        });

        // In production with pgvector, use raw SQL:
        // await prisma.$executeRaw`
        //   UPDATE "ResourceChunk" SET embedding = ${JSON.stringify(embedding)}::vector
        //   WHERE id = ${chunkId}
        // `
        void embedding; // suppress unused variable warning
      }

      await job.updateProgress(90);

      // 6. Mark as ready
      await prisma.resource.update({
        where: { id: resourceId },
        data: { status: "ready" },
      });

      await job.updateProgress(100);
      console.log(
        `[Worker] ✅ Completed job ${job.id}: ${chunks.length} chunks for workspace ${workspaceId}`,
      );
    },
    {
      connection: redisConnection,
      concurrency: 3,
    },
  );

  worker.on("failed", async (job, err) => {
    console.error(`[Worker] ❌ Job ${job?.id} failed:`, err.message);
    if (job?.data.resourceId) {
      await prisma.resource
        .update({
          where: { id: job.data.resourceId },
          data: { status: "failed" },
        })
        .catch((updateErr: unknown) => {
          console.error("[Worker] Failed to update resource status:", updateErr);
        });
    }
  });

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  return worker;
}
