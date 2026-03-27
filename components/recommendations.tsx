"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Novel {
  id: string;
  slug: string;
  title: string;
  cover: string;
  rating: number;
  author: { name: string };
  genres: { name: string }[];
  _count: { chapters: number };
}

interface RecommendationsProps {
  novelId: string;
}

export function Recommendations({ novelId }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch(`/api/novels/recommendations?novelId=${novelId}&limit=4`);
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [novelId]);

  if (loading) {
    return (
      <div className="mt-12 border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-bold text-stone-900">You Might Also Like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-xl bg-stone-200" />
              <div className="mt-2 h-4 w-3/4 rounded bg-stone-200" />
              <div className="mt-1 h-3 w-1/2 rounded bg-stone-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-stone-200 pt-8">
      <h2 className="text-2xl font-bold text-stone-900">You Might Also Like</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {recommendations.map((novel) => (
          <Link
            key={novel.id}
            href={`/novel/${novel.slug}`}
            className="group"
          >
            <div className="overflow-hidden rounded-xl bg-stone-100 shadow-md transition-all hover:shadow-lg">
              <img
                src={novel.cover}
                alt={novel.title}
                className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                {novel.title}
              </h3>
              <p className="mt-1 text-sm text-stone-500">{novel.author.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-amber-500">⭐ {novel.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500">{novel._count.chapters} chapters</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
