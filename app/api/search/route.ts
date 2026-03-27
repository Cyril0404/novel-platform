import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const novels = await prisma.novel.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { synopsis: { contains: query } },
        ],
      },
      include: {
        author: true,
        genres: true,
        _count: {
          select: { chapters: true },
        },
      },
      take: 10,
      orderBy: { views: "desc" },
    });

    const authors = await prisma.author.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { bio: { contains: query } },
        ],
      },
      take: 5,
    });

    return NextResponse.json({
      novels,
      authors,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
