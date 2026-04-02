import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { searchRequestSchema } from "@studyverse/shared";
import type { SearchResponse, SearchResult } from "@studyverse/shared";

// Mock search results for development
function generateMockResults(query: string, limit: number): SearchResult[] {
  const mockData: SearchResult[] = [
    {
      resourceId: "res_01",
      resourceTitle: "Introduction to Machine Learning",
      chunkContent: `This passage discusses key concepts related to "${query}". In supervised learning, models are trained on labeled datasets where each example has an input-output pair...`,
      score: 0.96,
    },
    {
      resourceId: "res_02",
      resourceTitle: "Deep Learning Fundamentals",
      chunkContent: `Advanced topics related to "${query}" include neural architecture search, attention mechanisms, and transformer models that have revolutionized NLP...`,
      score: 0.89,
    },
    {
      resourceId: "res_03",
      resourceTitle: "Research Notes — Week 12",
      chunkContent: `Personal notes on "${query}": The core insight here is that gradient descent optimization requires careful tuning of learning rate and batch size...`,
      score: 0.82,
    },
    {
      resourceId: "res_04",
      resourceTitle: "Computer Science Fundamentals",
      chunkContent: `Foundational concepts connecting to "${query}" include algorithmic complexity, data structures, and the theoretical underpinnings of computational systems...`,
      score: 0.74,
    },
  ];

  return mockData.slice(0, limit);
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const body = {
      query: searchParams.get("query") ?? "",
      workspaceId: searchParams.get("workspaceId") ?? "",
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
    };

    const parsed = searchRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { query, limit } = parsed.data;

    // Simulate vector search latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const results = generateMockResults(query, limit);

    const response: SearchResponse = { results, query };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[Search] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
