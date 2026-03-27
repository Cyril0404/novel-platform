import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get recently updated novels (trending = recently updated with most activity)
    const novels = await prisma.novel.findMany({
      include: {
        author: true,
        genres: true,
        tags: true,
        chapters: {
          orderBy: { publishedAt: "desc" },
          take: 1,
        },
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    return NextResponse.json(novels);
  } catch (error) {
    console.error("Trending GET error:", error);
    return NextResponse.json({ error: "Failed to fetch trending novels" }, { status: 500 });
  }
}