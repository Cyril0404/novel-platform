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
      return NextResponse.json([]);
    }

    const where = chapterId ? { userId: user.id, chapterId } : { userId: user.id };

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        chapter: {
          include: {
            novel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Bookmarks GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { chapterId, position, note } = body;

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

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        chapterId,
        position: position || 0,
        note: note || null,
      },
      include: {
        chapter: {
          include: {
            novel: true,
          },
        },
      },
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Bookmarks POST error:", error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const bookmarkId = searchParams.get("id");

    if (!bookmarkId) {
      return NextResponse.json({ error: "Bookmark ID required" }, { status: 400 });
    }

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

    await prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bookmarks DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
