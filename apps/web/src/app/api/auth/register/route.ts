import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@studyverse/shared";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { email, name, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
      select: { id: true, email: true, name: true },
    });

    // Create a default workspace for the user
    const workspace = await prisma.workspace.create({
      data: { name: `${name ?? email.split("@")[0]}'s Workspace` },
    });

    await prisma.workspaceMember.create({
      data: { userId: user.id, workspaceId: workspace.id, role: "owner" },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("[Register] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
