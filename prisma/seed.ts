import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.bookmark.deleteMany();
  await prisma.readingProgress.deleteMany();
  await prisma.review.deleteMany();
  await prisma.bookshelf.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.novel.deleteMany();
  await prisma.author.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create genres
  const fantasy = await prisma.genre.create({
    data: { name: "Fantasy", slug: "fantasy" },
  });
  const sciFi = await prisma.genre.create({
    data: { name: "Sci-Fi", slug: "sci-fi" },
  });
  const romance = await prisma.genre.create({
    data: { name: "Romance", slug: "romance" },
  });
  const thriller = await prisma.genre.create({
    data: { name: "Thriller", slug: "thriller" },
  });

  // Create tags
  const immortalTag = await prisma.tag.create({
    data: { name: "Immortality", slug: "immortality" },
  });
  const reincarnationTag = await prisma.tag.create({
    data: { name: "Reincarnation", slug: "reincarnation" },
  });
  const actionTag = await prisma.tag.create({
    data: { name: "Action", slug: "action" },
  });
  const mysteryTag = await prisma.tag.create({
    data: { name: "Mystery", slug: "mystery" },
  });

  // Create authors
  const marcusChen = await prisma.author.create({
    data: {
      name: "Marcus Chen",
      slug: "marcus-chen",
      bio: "Marcus Chen is a bestselling fantasy author known for his epic world-building and complex characters. He has published over 20 novels.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  });

  const yukiTanaka = await prisma.author.create({
    data: {
      name: "Yuki Tanaka",
      slug: "yuki-tanaka",
      bio: "Yuki Tanaka writes cyberpunk and sci-fi with a focus on Japanese culture and technology.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  });

  const elenaVoss = await prisma.author.create({
    data: {
      name: "Elena Voss",
      slug: "elena-voss",
      bio: "Award-winning romance author known for emotionally rich stories.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
  });

  const jamesBlackwood = await prisma.author.create({
    data: {
      name: "James Blackwood",
      slug: "james-blackwood",
      bio: "Former journalist turned thriller writer, specializes in conspiracy thrillers.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  });

  // Create novels
  const novel1 = await prisma.novel.create({
    data: {
      slug: "the-eternal-emperor",
      title: "The Eternal Emperor",
      synopsis:
        "In a world where immortality is within reach, one emperor must choose between eternal life and the love that defines his humanity.\n\nEmperor Kaios has ruled the Celestial Empire for three thousand years. His power is absolute, his lifespan endless. But when he meets Mei, a simple healer from the countryside, his eternal existence becomes a curse rather than a blessing.",
      cover:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
      status: "ONGOING",
      rating: 4.8,
      totalRatings: 24567,
      views: 1250000,
      authorId: marcusChen.id,
      genres: { connect: [{ id: fantasy.id }] },
      tags: { connect: [{ id: immortalTag.id }, { id: reincarnationTag.id }] },
    },
  });

  const novel2 = await prisma.novel.create({
    data: {
      slug: "cyber-ronin",
      title: "Cyber Ronin",
      synopsis:
        "The last samurai warrior in Neo-Tokyo trades his sword for a laser blade, seeking revenge in a city ruled by corporations.",
      cover:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=400&fit=crop",
      status: "COMPLETED",
      rating: 4.6,
      totalRatings: 12340,
      views: 890000,
      authorId: yukiTanaka.id,
      genres: { connect: [{ id: sciFi.id }] },
      tags: { connect: [{ id: actionTag.id }] },
    },
  });

  const novel3 = await prisma.novel.create({
    data: {
      slug: "midnight-garden",
      title: "Midnight Garden",
      synopsis:
        "A botanical mystery unfolds when a reclusive heiress begins communicating with her neighbor through flowers.",
      cover:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=400&fit=crop",
      status: "ONGOING",
      rating: 4.9,
      totalRatings: 34210,
      views: 2100000,
      authorId: elenaVoss.id,
      genres: { connect: [{ id: romance.id }] },
      tags: { connect: [{ id: mysteryTag.id }] },
    },
  });

  const novel4 = await prisma.novel.create({
    data: {
      slug: "shadow-conspiracy",
      title: "Shadow Conspiracy",
      synopsis:
        "A journalist uncovers a conspiracy that dates back centuries, threatening everything she thought she knew about history.",
      cover:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&h=400&fit=crop",
      status: "COMPLETED",
      rating: 4.5,
      totalRatings: 8765,
      views: 670000,
      authorId: jamesBlackwood.id,
      genres: { connect: [{ id: thriller.id }] },
      tags: { connect: [{ id: mysteryTag.id }] },
    },
  });

  // Create chapters for The Eternal Emperor
  const chapterTitles = [
    "The Beginning of the End",
    "A Fateful Encounter",
    "Whispers in the Dark",
    "The Immortal's Burden",
    "Love Against Eternity",
    "The Council's Judgment",
    "Shadows Rise",
    "A Heart's Dilemma",
    "The Price of Immortality",
    "Reunion",
  ];

  for (let i = 1; i <= 10; i++) {
    await prisma.chapter.create({
      data: {
        novelId: novel1.id,
        number: i,
        title: `Chapter ${i}: ${chapterTitles[i - 1]}`,
        content: `This is the content of chapter ${i}. In a world where immortality is within reach, Emperor Kaios has ruled the Celestial Empire for three thousand years. His power is absolute, his lifespan endless.\n\nThe cherry blossoms fell like pink snow, carpeting the ancient pathways of the imperial garden. Three thousand years he had walked these paths, yet today they felt different somehow. The petals that once brought him peace now served only to remind him of all he had lost.\n\n"Mei," he whispered to the wind, her name a prayer on his lips.\n\nThe Immortal Council had given their verdict three days ago. Either he would banish the healer who had brought color back to his eternal existence, or he would face the consequences of his weakness.\n\n[This is sample content for demonstration purposes. In a real application, this would be the actual chapter text spanning many pages...]`,
        wordCount: Math.floor(Math.random() * 2000) + 3000,
      },
    });
  }

  // Create chapters for Cyber Ronin
  for (let i = 1; i <= 10; i++) {
    await prisma.chapter.create({
      data: {
        novelId: novel2.id,
        number: i,
        title: `Chapter ${i}: Neon Streets`,
        content: `Chapter ${i} content for Cyber Ronin. The last samurai warrior in Neo-Tokyo trades his sword for a laser blade, seeking revenge in a city ruled by corporations.\n\nRain fell in sheets of liquid light, holographic advertisements flickering through the downpour like ghosts of commerce past. The megacity never slept, couldn't sleep, its neon arteries pumping data and desire through ten billion veins.\n\n[Sample content continues...]`,
        wordCount: Math.floor(Math.random() * 2000) + 3000,
      },
    });
  }

  // Create a demo user
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@novelflow.com",
      name: "Demo Reader",
    },
  });

  // Add some novels to demo user's bookshelf
  await prisma.bookshelf.create({
    data: {
      userId: demoUser.id,
      novelId: novel1.id,
      status: "READING",
    },
  });

  await prisma.bookshelf.create({
    data: {
      userId: demoUser.id,
      novelId: novel2.id,
      status: "COMPLETED",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`   - ${await prisma.genre.count()} genres`);
  console.log(`   - ${await prisma.tag.count()} tags`);
  console.log(`   - ${await prisma.author.count()} authors`);
  console.log(`   - ${await prisma.novel.count()} novels`);
  console.log(`   - ${await prisma.chapter.count()} chapters`);
  console.log(`   - ${await prisma.user.count()} users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
