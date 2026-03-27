import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const tags = searchParams.get("tags");
    const status = searchParams.get("status");
    const slug = searchParams.get("slug");
    const sort = searchParams.get("sort") || "views";

    const where: Record<string, unknown> = {};

    if (slug) {
      where.slug = slug;
    }

    if (genre) {
      where.genres = {
        some: { slug: genre },
      };
    }

    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      where.tags = {
        some: { slug: { in: tagList } },
      };
    }

    if (status) {
      where.status = status;
    }

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case "rating":
        orderBy.rating = "desc";
        break;
      case "views":
        orderBy.views = "desc";
        break;
      case "newest":
        orderBy.createdAt = "desc";
        break;
      case "updated":
        orderBy.updatedAt = "desc";
        break;
      default:
        orderBy.views = "desc";
    }

    const novels = await prisma.novel.findMany({
      where,
      include: {
        author: true,
        genres: true,
        tags: true,
        chapters: slug ? {
          orderBy: { number: "desc" },
          take: 100,
        } : false,
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: slug ? undefined : orderBy,
    });

    return NextResponse.json(novels);
  } catch (error) {
    console.error("Novels GET error:", error);
    return NextResponse.json({ error: "Failed to fetch novels" }, { status: 500 });
  }
}