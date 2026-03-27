import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const { prisma } = await import("@/lib/prisma");

    const user = session?.user?.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
        })
      : await prisma.user.findFirst({
          where: { email: "demo@novelflow.com" },
        });

    if (!user) {
      return NextResponse.json([]);
    }

    const bookshelf = await prisma.bookshelf.findMany({
      where: { userId: user.id },
      include: {
        novel: {
          include: {
            author: true,
            genres: true,
            chapters: {
              orderBy: { number: "desc" },
              take: 1,
            },
            _count: { select: { chapters: true } },
          },
        },
      },
    });

    // Get reading progress to determine new chapters
    const readingProgress = await prisma.readingProgress.findMany({
      where: { userId: user.id },
      include: {
        chapter: {
          select: { novelId: true, number: true },
        },
      },
    });

    const progressMap = new Map(
      readingProgress.map((p) => [p.chapter.novelId, p.chapter.number])
    );

    // Add new chapter info to each bookshelf item
    const itemsWithNewChapters = bookshelf.map((item) => {
      const lastReadChapter = progressMap.get(item.novelId);
      const latestChapter = item.novel.chapters[0]?.number || 0;
      const hasNewChapters =
        lastReadChapter !== undefined && latestChapter > lastReadChapter;

      return {
        ...item,
        hasNewChapters,
        newChapterCount: hasNewChapters ? latestChapter - (lastReadChapter || 0) : 0,
        latestChapterNumber: latestChapter,
      };
    });

    return NextResponse.json(itemsWithNewChapters);
  } catch (error) {
    console.error("Bookshelf GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookshelf" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { novelId, status = "READING" } = body;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bookshelfItem = await prisma.bookshelf.upsert({
      where: {
        userId_novelId: {
          userId: user.id,
          novelId,
        },
      },
      update: { status },
      create: {
        userId: user.id,
        novelId,
        status,
      },
      include: {
        novel: {
          include: {
            author: true,
            genres: true,
            _count: { select: { chapters: true } },
          },
        },
      },
    });

    return NextResponse.json(bookshelfItem);
  } catch (error) {
    console.error("Bookshelf POST error:", error);
    return NextResponse.json({ error: "Failed to update bookshelf" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const novelId = searchParams.get("novelId");

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!novelId) {
      return NextResponse.json({ error: "novelId required" }, { status: 400 });
    }

    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.bookshelf.delete({
      where: {
        userId_novelId: {
          userId: user.id,
          novelId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bookshelf DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove from bookshelf" }, { status: 500 });
  }
}
