"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RankedNovel {
  id: string;
  slug: string;
  title: string;
  cover: string;
  rating: number;
  views: number;
  rank: number;
  hotScore: number;
  author: { name: string };
  genres: { name: string }[];
  _count: { chapters: number; reviews: number };
}

export default function RankingsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [novels, setNovels] = useState<RankedNovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/novels/rankings?period=${period}&limit=50`);
        const data = await res.json();
        setNovels(data);
      } catch (error) {
        console.error("Failed to fetch rankings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, [period]);

  const periodLabels = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "from-amber-400 to-yellow-500";
    if (rank === 2) return "from-stone-300 to-gray-400";
    if (rank === 3) return "from-amber-600 to-amber-700";
    return "from-stone-100 to-stone-200";
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-stone-900">🔥 Hot Rankings</h1>
          <p className="mt-2 text-stone-600">Discover the most popular novels</p>
        </div>

        {/* Period Filter */}
        <div className="mb-8 flex justify-center gap-2">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-6 py-2.5 font-medium transition-all ${
                period === p
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>

        {/* Rankings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 rounded-2xl bg-stone-100 p-4 h-32" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {novels.slice(0, 20).map((novel, i) => (
              <Link
                key={novel.id}
                href={`/novel/${novel.slug}`}
                className="group block"
              >
                <div className={`flex gap-4 rounded-2xl bg-gradient-to-r ${getRankBg(novel.rank)} p-4 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]`}>
                  {/* Rank */}
                  <div className="flex w-16 flex-shrink-0 items-center justify-center">
                    <span className="text-3xl font-bold text-white drop-shadow-lg">
                      {getRankIcon(novel.rank)}
                    </span>
                  </div>

                  {/* Cover */}
                  <div className="relative w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-md">
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-bold text-lg text-white drop-shadow-md line-clamp-1">
                      {novel.title}
                    </h3>
                    <p className="text-sm text-white/80">{novel.author.name}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                        ⭐ {novel.rating.toFixed(1)}
                      </span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                        👁 {novel.views.toLocaleString()}
                      </span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                        📖 {novel._count.chapters} chapters
                      </span>
                    </div>
                  </div>

                  {/* Hot Score */}
                  <div className="hidden flex-col items-end justify-center sm:flex">
                    <span className="text-3xl font-bold text-white drop-shadow-lg">
                      {novel.rank <= 3 ? "🔥" : "📈"}
                    </span>
                    <span className="text-xs text-white/70">Hot Score</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {novels.length > 20 && (
          <div className="mt-8 text-center">
            <button className="rounded-full border-2 border-stone-300 px-8 py-3 font-medium text-stone-600 transition-all hover:border-amber-500 hover:text-amber-600">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
