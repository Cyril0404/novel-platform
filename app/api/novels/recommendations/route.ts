import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const novelId = searchParams.get("novelId");
    const limit = parseInt(searchParams.get("limit") || "4");

    if (!novelId) {
      return NextResponse.json({ error: "novelId required" }, { status: 400 });
    }

    // Get the source novel with its genres
    const sourceNovel = await prisma.novel.findUnique({
      where: { id: novelId },
      include: {
        genres: true,
        tags: true,
      },
    });

    if (!sourceNovel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }

    const genreIds = sourceNovel.genres.map((g) => g.id);
    const tagIds = sourceNovel.tags.map((t) => t.id);

    // Find novels with similar genres and tags, excluding the source novel
    const recommendations = await prisma.novel.findMany({
      where: {
        id: { not: novelId },
        OR: [
          // Same genres
          { genres: { some: { id: { in: genreIds } } } },
          // Same tags
          { tags: { some: { id: { in: tagIds } } } },
        ],
      },
      include: {
        author: true,
        genres: true,
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: [
        // Prioritize by rating
        { rating: "desc" },
        // Then by views
        { views: "desc" },
      ],
      take: limit,
    });

    // If not enough recommendations, fill with popular novels
    if (recommendations.length < limit) {
      const existingIds = recommendations.map((r) => r.id);
      const additionalNovels = await prisma.novel.findMany({
        where: {
          id: { not: novelId, notIn: existingIds },
        },
        include: {
          author: true,
          genres: true,
          _count: {
            select: { chapters: true },
          },
        },
        orderBy: { rating: "desc" },
        take: limit - recommendations.length,
      });
      recommendations.push(...additionalNovels);
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
