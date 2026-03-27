import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const author = await prisma.author.findUnique({
      where: { slug: params.slug },
      include: {
        novels: {
          include: {
            genres: true,
            _count: {
              select: { chapters: true },
            },
          },
          orderBy: { views: "desc" },
        },
      },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error("Author fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch author" }, { status: 500 });
  }
}
