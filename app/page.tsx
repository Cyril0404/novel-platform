import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // Fetch featured novels (top rated)
  const featuredNovels = await prisma.novel.findMany({
    include: {
      author: true,
      genres: true,
      _count: { select: { chapters: true } },
    },
    orderBy: { rating: "desc" },
    take: 4,
  });

  // Fetch trending/recently updated novels
  const trendingNovels = await prisma.novel.findMany({
    include: {
      author: true,
      genres: true,
      _count: { select: { chapters: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 8,
  });

  // Fetch all genres for the genre section
  const genres = await prisma.genre.findMany({
    include: {
      _count: { select: { novels: true } },
    },
    take: 6,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-900/20 dark:via-orange-900/10 dark:to-rose-900/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-32">
          <div className="text-center animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm backdrop-blur-sm dark:bg-stone-800/80 dark:text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              New stories added daily
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl lg:text-7xl animate-fade-in-up stagger-1">
              Discover Your Next
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Great Read</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 dark:text-stone-400 sm:text-xl animate-fade-in-up stagger-2">
              Thousands of stories await. From epic fantasies to heartwarming romances, find worlds you can lose yourself in.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-3">
              <Link
                href="/novels"
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-amber-200/50 transition-all hover:shadow-2xl hover:shadow-amber-300/50 hover:-translate-y-0.5 btn-press"
              >
                Browse Novels
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/auth/signin"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-stone-300 bg-white/80 px-8 py-4 text-lg font-semibold text-stone-700 shadow-lg backdrop-blur-sm transition-all hover:border-amber-300 hover:bg-white hover:shadow-xl dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-300"
              >
                Sign In
                <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 5z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 opacity-20 blur-3xl dark:from-amber-700/30 dark:to-orange-700/30" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 opacity-20 blur-3xl dark:from-rose-700/30 dark:to-amber-700/30" />
      </section>

      {/* Trending/Recently Updated Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Recently Updated</h2>
              <p className="mt-2 text-stone-600 dark:text-stone-400">Fresh chapters from your favorite novels</p>
            </div>
            <Link
              href="/novels?sort=updated"
              className="group inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium dark:text-amber-400"
            >
              View All
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingNovels.map((novel, i) => (
              <Link
                key={novel.id}
                href={`/novel/${novel.slug}`}
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="card-hover h-full overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-stone-800">
                  <div className="relative overflow-hidden">
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center justify-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-amber-600 backdrop-blur-sm">
                        <span>⭐</span>
                        <span>{novel.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                      NEW
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 text-xs font-medium text-amber-700 dark:from-amber-900/50 dark:to-orange-900/50 dark:text-amber-400">
                      {novel.genres[0]?.name || "Unknown"}
                    </span>
                    <h3 className="mt-3 font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1 dark:text-stone-100">
                      {novel.title}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{novel.author.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-gradient-to-b from-stone-100 to-white dark:from-stone-900/50 dark:to-stone-800/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Top Rated</h2>
              <p className="mt-2 text-stone-600 dark:text-stone-400">Highest rated novels by our readers</p>
            </div>
            <Link
              href="/novels?sort=rating"
              className="group inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium dark:text-amber-400"
            >
              View All
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredNovels.map((novel, i) => (
              <Link
                key={novel.id}
                href={`/novel/${novel.slug}`}
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="card-hover h-full overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-stone-800">
                  <div className="relative overflow-hidden">
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center justify-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-amber-600 backdrop-blur-sm">
                        <span>⭐</span>
                        <span>{novel.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 text-xs font-medium text-amber-700 dark:from-amber-900/50 dark:to-orange-900/50 dark:text-amber-400">
                      {novel.genres[0]?.name || "Unknown"}
                    </span>
                    <h3 className="mt-3 font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1 dark:text-stone-100">
                      {novel.title}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{novel.author.name}</p>
                    <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
                      {novel._count.chapters} chapters
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100">Browse by Genre</h2>
            <p className="mt-2 text-stone-600 dark:text-stone-400">Find stories that match your mood</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {genres.map((genre, i) => (
              <Link
                key={genre.id}
                href={`/novels?genre=${genre.slug}`}
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
              >
                <div className="card-hover flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md dark:bg-stone-800">
                  <span className="text-4xl transition-transform group-hover:scale-110">
                    {genre.name === "Fantasy" ? "🐉" :
                     genre.name === "Sci-Fi" ? "🚀" :
                     genre.name === "Romance" ? "💕" :
                     genre.name === "Thriller" ? "🔍" :
                     genre.name === "Mystery" ? "🔐" : "👻"}
                  </span>
                  <h3 className="mt-3 font-semibold text-stone-900 group-hover:text-amber-600 transition-colors dark:text-stone-100">
                    {genre.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                    {genre._count.novels.toLocaleString()} novels
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "50K+", label: "Active Readers", icon: "📚" },
              { value: "10K+", label: "Novels", icon: "📖" },
              { value: "100M+", label: "Chapters Read", icon: "✨" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="animate-fade-in-up opacity-0 text-center"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="text-4xl">{stat.icon}</div>
                <p className="mt-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-4xl font-bold text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-stone-600 dark:text-stone-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 to-orange-600 p-12 text-center shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Start Your Reading Journey Today
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Join thousands of readers discovering new stories every day. Free to start, with premium options available.
              </p>
              <Link
                href="/auth/signin"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-amber-600 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5"
              >
                Get Started Free
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 5z" />
                </svg>
              </Link>
            </div>
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}