import Link from "next/link";
import { notFound } from "next/navigation";

async function getAuthor(slug: string) {
  const { prisma } = await import("@/lib/prisma");
  return prisma.author.findUnique({
    where: { slug },
    include: {
      novels: {
        include: {
          genres: true,
          _count: { select: { chapters: true } },
        },
        orderBy: { views: "desc" },
      },
    },
  });
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const author = await getAuthor(params.slug);

  if (!author) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Author Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div className="flex-shrink-0">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-32 w-32 rounded-full object-cover shadow-xl"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-4xl font-bold text-white shadow-xl">
                  {author.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="mt-6 sm:ml-8 sm:mt-0">
              <h1 className="text-3xl font-bold text-stone-900">{author.name}</h1>
              <p className="mt-2 text-stone-600">{author.bio || "No bio available."}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
                  {author.novels.length} Novels
                </span>
                <span className="rounded-full bg-stone-100 px-4 py-1.5 text-sm font-medium text-stone-600">
                  {author.novels.reduce((acc, n) => acc + n._count.chapters, 0)} Chapters
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Novels */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-stone-900">Novels by {author.name}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {author.novels.map((novel, i) => (
              <Link
                key={novel.id}
                href={`/novel/${novel.slug}`}
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
              >
                <div className="card-hover h-full overflow-hidden rounded-2xl bg-white shadow-lg">
                  <div className="relative overflow-hidden">
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      {novel.genres[0]?.name || "Unknown"}
                    </span>
                    <h3 className="mt-3 font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {novel.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between text-sm text-stone-500">
                      <span>{novel._count.chapters} chapters</span>
                      <span>⭐ {novel.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
