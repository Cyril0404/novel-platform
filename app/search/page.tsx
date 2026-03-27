import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";

  if (!query || query.length < 2) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold text-stone-900">Search</h1>
          <p className="mt-4 text-stone-600">Enter at least 2 characters to search.</p>
        </div>
      </div>
    );
  }

  const [novels, authors] = await Promise.all([
    prisma.novel.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { synopsis: { contains: query } },
        ],
      },
      include: {
        author: true,
        genres: true,
        _count: { select: { chapters: true } },
      },
      take: 20,
      orderBy: { views: "desc" },
    }),
    prisma.author.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { bio: { contains: query } },
        ],
      },
      take: 10,
    }),
  ]);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-stone-900">
            Search results for &quot;{query}&quot;
          </h1>
          <p className="mt-2 text-stone-600">
            Found {novels.length} novels and {authors.length} authors
          </p>
        </div>

        {/* Novels Results */}
        {novels.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-stone-900">Novels</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {novels.map((novel, i) => (
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
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                      <p className="mt-1 text-sm text-stone-500">{novel.author.name}</p>
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
        )}

        {/* Authors Results */}
        {authors.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-stone-900">Authors</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {authors.map((author, i) => (
                <Link
                  key={author.id}
                  href={`/author/${author.slug}`}
                  className="group animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
                >
                  <div className="card-hover h-full overflow-hidden rounded-2xl bg-white shadow-lg p-6 text-center">
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="mx-auto h-24 w-24 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-4xl font-bold text-white shadow-lg">
                        {author.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="mt-4 font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors">
                      {author.name}
                    </h3>
                    <p className="mt-2 text-sm text-stone-500 line-clamp-2">
                      {author.bio || "No bio available"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {novels.length === 0 && authors.length === 0 && (
          <div className="animate-fade-in rounded-3xl border-2 border-dashed border-stone-300 py-20 text-center">
            <div className="text-6xl">🔍</div>
            <h3 className="mt-4 text-xl font-semibold text-stone-700">
              No results found
            </h3>
            <p className="mt-2 text-stone-500">
              Try different keywords or check your spelling
            </p>
            <Link
              href="/novels"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl"
            >
              Browse all novels
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}