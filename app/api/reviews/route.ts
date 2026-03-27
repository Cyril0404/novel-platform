import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const novelId = searchParams.get("novelId");

    if (!novelId) {
      return NextResponse.json({ error: "novelId required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { novelId },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { novelId, rating, content } = body;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!novelId || !rating) {
      return NextResponse.json({ error: "novelId and rating required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or update review
    const review = await prisma.review.upsert({
      where: {
        userId_novelId: {
          userId: user.id,
          novelId,
        },
      },
      update: { rating, content },
      create: {
        userId: user.id,
        novelId,
        rating,
        content,
      },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    });

    // Update novel rating
    const allReviews = await prisma.review.findMany({
      where: { novelId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.novel.update({
      where: { id: novelId },
      data: {
        rating: avgRating,
        totalRatings: allReviews.length,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
