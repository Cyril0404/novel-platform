import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "daily"; // daily, weekly, monthly
    const limit = parseInt(searchParams.get("limit") || "20");

    // For now, we use views and ratings as the ranking criteria
    // In production, you would track daily/weekly views in a separate table
    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "weekly":
        dateFilter = {
          updatedAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      case "monthly":
        dateFilter = {
          updatedAt: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      default:
        // Daily - use today's views (would need a views tracking table in production)
        dateFilter = {
          updatedAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
        };
    }

    // Get novels sorted by a composite score
    // In production, this would track actual daily/weekly views
    const novels = await prisma.novel.findMany({
      where: {
        ...dateFilter,
      },
      include: {
        author: true,
        genres: true,
        _count: {
          select: { chapters: true, reviews: true },
        },
      },
      orderBy: [
        { views: "desc" },
        { rating: "desc" },
      ],
      take: limit,
    });

    // Calculate a hot score for ranking
    const novelsWithScore = novels.map((novel, index) => ({
      ...novel,
      hotScore: novel.views + novel.rating * 1000 + (novel._count.reviews * 100),
      rank: index + 1,
    }));

    // Sort by hot score
    novelsWithScore.sort((a, b) => b.hotScore - a.hotScore);

    return NextResponse.json(novelsWithScore);
  } catch (error) {
    console.error("Rankings error:", error);
    return NextResponse.json({ error: "Failed to fetch rankings" }, { status: 500 });
  }
}
