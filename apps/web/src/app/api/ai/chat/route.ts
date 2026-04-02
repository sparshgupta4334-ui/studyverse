import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { aiChatRequestSchema } from "@studyverse/shared";
import type { AIChatResponse, Citation } from "@studyverse/shared";
import { randomUUID } from "crypto";

// Mock citations for development
const mockCitations: Citation[] = [
  {
    resourceId: "res_01",
    resourceTitle: "Introduction to Machine Learning",
    chunkContent:
      "Supervised learning is a type of machine learning where the algorithm learns from labeled training data to make predictions or decisions.",
    relevanceScore: 0.95,
  },
  {
    resourceId: "res_02",
    resourceTitle: "Deep Learning Fundamentals",
    chunkContent:
      "Neural networks consist of layers of interconnected nodes that process information using connectionist approaches to computation.",
    relevanceScore: 0.87,
  },
];

// Mock AI responses based on common study topics
function generateMockResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("machine learning") || lower.includes("ml")) {
    return `Based on your uploaded materials, **machine learning** is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.\n\nKey concepts covered in your resources:\n\n1. **Supervised Learning** — Training on labeled datasets to predict outputs\n2. **Unsupervised Learning** — Finding hidden patterns in unlabeled data\n3. **Reinforcement Learning** — Learning through reward/penalty feedback\n\nYour notes on neural networks connect directly to these foundations. Would you like me to elaborate on any specific area?`;
  }

  if (lower.includes("quantum")) {
    return `From your research materials, **quantum mechanics** describes physical phenomena at atomic and subatomic scales where classical physics breaks down.\n\n**Key principles from your resources:**\n- Wave-particle duality\n- Heisenberg's Uncertainty Principle\n- Quantum superposition and entanglement\n\nYour uploaded PDF (Deep Learning Fundamentals) touches on quantum-inspired algorithms in section 4. Shall I pull more context from that document?`;
  }

  return `Based on your workspace resources, here's what I found relevant to your question about **"${message}"**:\n\nYour uploaded materials contain several relevant passages. The key insight appears to be that this topic connects multiple domains covered in your notes.\n\n**From your resources:**\n- Your notes mention related concepts in the context of theoretical frameworks\n- Your uploaded PDF provides empirical evidence supporting these theories\n- The semantic search found 3 highly relevant chunks\n\nI synthesized this from ${mockCitations.length} source documents. Would you like me to dive deeper into any specific aspect?`;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as unknown;
    const parsed = aiChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { message } = parsed.data;

    // In production: run vector similarity search → pass chunks to OpenAI
    // For now, return a convincing mock response
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate processing

    const response: AIChatResponse = {
      response: generateMockResponse(message),
      citations: mockCitations.slice(0, 2),
      conversationId: randomUUID(),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[AI Chat] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
