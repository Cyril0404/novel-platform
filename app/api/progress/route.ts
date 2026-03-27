import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");

    const email = session?.user?.email || "demo@novelflow.com";

    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findFirst({
      where: email === "demo@novelflow.com"
        ? { email: "demo@novelflow.com" }
        : { email },
    });

    if (!user) {
      return NextResponse.json(null);
    }

    if (chapterId) {
      const progress = await prisma.readingProgress.findUnique({
        where: {
          userId_chapterId: {
            userId: user.id,
            chapterId,
          },
        },
      });
      return NextResponse.json(progress);
    }

    const progress = await prisma.readingProgress.findMany({
      where: { userId: user.id },
      include: {
        chapter: {
          include: {
            novel: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { chapterId, percentage = 100, chapterNumber } = body;

    const email = session?.user?.email || "demo@novelflow.com";

    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findFirst({
      where: email === "demo@novelflow.com"
        ? { email: "demo@novelflow.com" }
        : { email: session?.user?.email || "" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId,
        },
      },
      update: { percentage },
      create: {
        userId: user.id,
        chapterId,
        percentage,
        chapterNumber,
      },
    });

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { novel: true },
    });

    if (chapter) {
      await prisma.bookshelf.updateMany({
        where: {
          userId: user.id,
          novelId: chapter.novelId,
        },
        data: { status: "READING" },
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Progress POST error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
