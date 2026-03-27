/**
 * Public Domain Book Import Utility
 *
 * This script imports books from the content/ directory into the database.
 * Books should be organized as:
 *   content/{language}/{book-slug}/chapter_{n}.md
 *
 * Usage:
 *   npx tsx lib/import-books.ts
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface BookMeta {
  slug: string;
  title: string;
  author: string;
  authorSlug: string;
  synopsis: string;
  cover: string;
  language: string;
  genres: string[];
  tags: string[];
}

const BOOK_METADATA: Record<string, BookMeta> = {
  "journey-to-the-west": {
    slug: "journey-to-the-west",
    title: "Journey to the West",
    author: "Wu Cheng'en",
    authorSlug: "wu-chengen",
    synopsis:
      "Journey to the West is a Chinese novel published in the 16th century during the Ming dynasty. The story is about the pilgrimage of the monk Tang Sanzang to India to obtain Buddhist sutras.",
    cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
    language: "en",
    genres: ["Classics", "Adventure", "Fantasy"],
    tags: ["Chinese Literature", "Mythology", "Buddhism"],
  },
  "tao-te-ching": {
    slug: "tao-te-ching",
    title: "Tao Te Ching",
    author: "Lao Tzu",
    authorSlug: "lao-tzu",
    synopsis:
      "The Tao Te Ching is a Chinese classic text written around 400 BC by the sage Lao Tzu. It is a fundamental text for both philosophical and religious Taoism.",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop",
    language: "en",
    genres: ["Philosophy", "Classics"],
    tags: ["Chinese Literature", "Taoism", "Wisdom"],
  },
};

async function importBook(bookSlug: string, language: string) {
  const contentDir = path.join(process.cwd(), "content", language, bookSlug);

  if (!fs.existsSync(contentDir)) {
    console.log(`📁 Content directory not found: ${contentDir}`);
    return;
  }

  const meta = BOOK_METADATA[bookSlug];
  if (!meta) {
    console.log(`⚠️  No metadata found for book: ${bookSlug}`);
    return;
  }

  console.log(`\n📚 Importing: ${meta.title}`);

  // Create or update author
  const author = await prisma.author.upsert({
    where: { slug: meta.authorSlug },
    update: { name: meta.author },
    create: {
      name: meta.author,
      slug: meta.authorSlug,
      bio: `Author of ${meta.title}`,
    },
  });
  console.log(`  ✓ Author: ${author.name}`);

  // Create or get genres
  const genreRecords = await Promise.all(
    meta.genres.map((genreName) =>
      prisma.genre.upsert({
        where: { slug: genreName.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: {
          name: genreName,
          slug: genreName.toLowerCase().replace(/\s+/g, "-"),
        },
      })
    )
  );

  // Create or get tags
  const tagRecords = await Promise.all(
    meta.tags.map((tagName) =>
      prisma.tag.upsert({
        where: { slug: tagName.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, "-"),
        },
      })
    )
  );

  // Create or update novel
  const novel = await prisma.novel.upsert({
    where: { slug: meta.slug },
    update: {
      synopsis: meta.synopsis,
      cover: meta.cover,
    },
    create: {
      slug: meta.slug,
      title: meta.title,
      synopsis: meta.synopsis,
      cover: meta.cover,
      status: "COMPLETED",
      rating: 5.0,
      totalRatings: 0,
      views: 0,
      authorId: author.id,
      genres: { connect: genreRecords.map((g) => ({ id: g.id })) },
      tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
    },
  });
  console.log(`  ✓ Novel: ${novel.title}`);

  // Import chapters
  const chapterFiles = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/chapter_(\d+)/)?.[1] || "0");
      const numB = parseInt(b.match(/chapter_(\d+)/)?.[1] || "0");
      return numA - numB;
    });

  let chaptersImported = 0;
  for (const file of chapterFiles) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    // Extract chapter number from filename
    const chapterNum = parseInt(file.match(/chapter_(\d+)/)?.[1] || "1");

    // Extract title from first heading if present
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const chapterTitle = titleMatch
      ? titleMatch[1]
      : `Chapter ${chapterNum}`;

    // Strip markdown headings for content
    const chapterContent = content.replace(/^#\s+.+$/m, "").trim();

    await prisma.chapter.upsert({
      where: {
        novelId_number: {
          novelId: novel.id,
          number: chapterNum,
        },
      },
      update: {
        title: chapterTitle,
        content: chapterContent,
        wordCount: chapterContent.split(/\s+/).length,
      },
      create: {
        novelId: novel.id,
        number: chapterNum,
        title: chapterTitle,
        content: chapterContent,
        wordCount: chapterContent.split(/\s+/).length,
      },
    });
    chaptersImported++;
  }
  console.log(`  ✓ Chapters imported: ${chaptersImported}`);
}

async function main() {
  console.log("🌱 Starting Public Domain Book Import...\n");

  const contentDir = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentDir)) {
    console.log("❌ Content directory not found!");
    console.log("   Please create the content/ directory with your books.");
    return;
  }

  const languages = fs.readdirSync(contentDir).filter((d) =>
    fs.statSync(path.join(contentDir, d)).isDirectory()
  );

  console.log(`📂 Found languages: ${languages.join(", ")}`);

  for (const language of languages) {
    const langDir = path.join(contentDir, language);
    const books = fs.readdirSync(langDir).filter((d) =>
      fs.statSync(path.join(langDir, d)).isDirectory()
    );

    for (const book of books) {
      await importBook(book, language);
    }
  }

  console.log("\n✅ Import complete!");
  console.log(`   - ${await prisma.novel.count()} novels`);
  console.log(`   - ${await prisma.chapter.count()} chapters`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
