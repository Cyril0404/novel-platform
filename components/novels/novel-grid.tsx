"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SkeletonGrid } from "@/components/ui/skeleton";

interface Novel {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  cover: string;
  status: string;
  rating: number;
  views: number;
  createdAt: string;
  author: { name: string };
  genres: { name: string }[];
  _count: { chapters: number };
}

export function NovelGrid() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("popularity");

  useEffect(() => {
    async function fetchNovels() {
      try {
        const res = await fetch("/api/novels");
        const data = await res.json();
        setNovels(data);
        setFilteredNovels(data);
      } catch (error) {
        console.error("Failed to fetch novels:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNovels();
  }, []);

  useEffect(() => {
    let result = [...novels];

    if (genre !== "All") {
      result = result.filter((n) =>
        n.genres.some((g) => g.name === genre)
      );
    }

    if (status !== "All") {
      result = result.filter((n) => {
        if (status === "Ongoing") return n.status === "ONGOING";
        if (status === "Completed") return n.status === "COMPLETED";
        if (status === "Hiatus") return n.status === "HIATUS";
        return true;
      });
    }

    switch (sort) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "views":
        result.sort((a, b) => b.views - a.views);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        result.sort((a, b) => b.views - a.views);
    }

    setFilteredNovels(result);
  }, [novels, genre, status, sort]);

  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 animate-fade-in">
        <div className="group">
          <label className="text-sm font-medium text-stone-600 transition-colors group-hover:text-amber-600">
            Genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-700 shadow-sm transition-all hover:border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option>All</option>
            <option>Fantasy</option>
            <option>Sci-Fi</option>
            <option>Romance</option>
            <option>Thriller</option>
          </select>
        </div>
        <div className="group">
          <label className="text-sm font-medium text-stone-600 transition-colors group-hover:text-amber-600">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-700 shadow-sm transition-all hover:border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option>All</option>
            <option>Ongoing</option>
            <option>Completed</option>
            <option>Hiatus</option>
          </select>
        </div>
        <div className="group">
          <label className="text-sm font-medium text-stone-600 transition-colors group-hover:text-amber-600">
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-700 shadow-sm transition-all hover:border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="views">Most Viewed</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Novel Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredNovels.map((novel, i) => (
          <Link
            key={novel.id}
            href={`/novel/${novel.slug}`}
            className="group block animate-fade-in-up opacity-0"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
          >
            <div className="card-hover h-full overflow-hidden rounded-2xl bg-white shadow-md">
              <div className="relative overflow-hidden">
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute left-3 top-3 flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
                      novel.status === "COMPLETED"
                        ? "bg-emerald-500/90 text-white"
                        : "bg-blue-500/90 text-white"
                    }`}
                  >
                    {novel.status === "ONGOING" ? "Ongoing" : novel.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center justify-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-amber-600 backdrop-blur-sm">
                    <span>⭐</span>
                    <span>{novel.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {novel.genres[0]?.name || "Unknown"}
                </span>
                <h3 className="mt-3 font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {novel.title}
                </h3>
                <p className="mt-1 text-sm text-stone-500">{novel.author.name}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">
                  {novel.synopsis}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                  <span className="text-xs text-stone-400">
                    {novel._count.chapters} chapters
                  </span>
                  <span className="text-xs font-medium text-amber-600">
                    {(novel.views / 1000000).toFixed(1)}M views
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredNovels.length === 0 && (
        <div className="animate-fade-in rounded-2xl border-2 border-dashed border-stone-300 py-20 text-center">
          <div className="text-6xl">📚</div>
          <h3 className="mt-4 text-xl font-semibold text-stone-700">No novels found</h3>
          <p className="mt-2 text-stone-500">Try adjusting your filters to find more stories</p>
          <button
            onClick={() => { setGenre("All"); setStatus("All"); }}
            className="mt-4 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-amber-700 hover:shadow-lg"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-2">
        <button className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-600 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
          ← Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`h-10 w-10 rounded-xl text-sm font-medium transition-all ${
                page === 1
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-white text-stone-600 shadow-sm hover:border-amber-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-600 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
          Next →
        </button>
      </div>
    </>
  );
}
