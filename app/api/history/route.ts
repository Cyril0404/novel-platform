import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get reading progress with chapter and novel info
    const progress = await prisma.readingProgress.findMany({
      where: { userId: user.id },
      include: {
        chapter: {
          include: {
            novel: {
              include: {
                author: true,
                genres: true,
                _count: { select: { chapters: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    // Group by novel and get the latest progress for each
    const historyMap = new Map();
    for (const p of progress) {
      if (!historyMap.has(p.chapter.novelId)) {
        historyMap.set(p.chapter.novelId, {
          novel: p.chapter.novel,
          lastReadChapter: p.chapter,
          lastReadAt: p.updatedAt,
          lastReadProgress: p.percentage,
        });
      }
    }

    const history = Array.from(historyMap.values()).sort(
      (a, b) => b.lastReadAt.getTime() - a.lastReadAt.getTime()
    );

    return NextResponse.json(history);
  } catch (error) {
    console.error("History GET error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}