import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ingestRequestSchema } from "@studyverse/shared";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as unknown;
    const parsed = ingestRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { resourceId, workspaceId, type } = parsed.data;

    // In production: enqueue BullMQ job via the workers service
    // We use a dynamic import to avoid bundling Redis in the web app
    // For now, return a mock job ID that represents a queued job
    const jobId = `job_${resourceId}_${Date.now()}`;

    console.log(
      `[Ingest] Queuing job ${jobId} for resource ${resourceId} (${type}) in workspace ${workspaceId}`,
    );

    // In full deployment, this would call:
    // const { enqueueIngestion } = await import("@studyverse/workers/queues/ingestion");
    // await enqueueIngestion({ resourceId, workspaceId, type });

    return NextResponse.json({ jobId, status: "queued" });
  } catch (err) {
    console.error("[Ingest] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
