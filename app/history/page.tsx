"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SkeletonBookshelf } from "@/components/ui/skeleton";

interface HistoryItem {
  novel: {
    id: string;
    slug: string;
    title: string;
    cover: string;
    author: { name: string };
    genres: { name: string }[];
    _count: { chapters: number };
  };
  lastReadChapter: {
    number: number;
    title: string;
  };
  lastReadAt: string;
  lastReadProgress: number;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }
    fetchHistory();
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-stone-200" />
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonBookshelf key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-stone-900">Reading History</h1>
          <p className="mt-2 text-stone-600">
            {session
              ? `Welcome back, ${session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}`
              : "Sign in to sync your reading history"}{" "}
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-sm font-medium text-amber-700">
              {history.length} novels
            </span>
          </p>
        </div>

        {/* History List */}
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, i) => (
              <div
                key={item.novel.id}
                className="animate-fade-in-up opacity-0 rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
              >
                <div className="flex">
                  <div className="relative w-24 flex-shrink-0 sm:w-32">
                    <Link href={`/novel/${item.novel.slug}`} className="block">
                      <img
                        src={item.novel.cover}
                        alt={item.novel.title}
                        className="h-full w-full rounded-l-2xl object-cover transition-transform hover:scale-105"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/novel/${item.novel.slug}`}>
                          <h3 className="font-bold text-lg text-stone-900 hover:text-amber-600 transition-colors line-clamp-1">
                            {item.novel.title}
                          </h3>
                        </Link>
                        <p className="mt-1 text-sm text-stone-500">{item.novel.author.name}</p>
                      </div>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500">
                        {formatTimeAgo(item.lastReadAt)}
                      </span>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-stone-500">
                        Chapter {item.lastReadChapter.number}: {item.lastReadChapter.title}
                      </p>
                      <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                          style={{ width: `${item.lastReadProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <p className="text-xs text-stone-400">
                        {item.novel._count.chapters} chapters total
                      </p>
                      <Link
                        href={`/novel/${item.novel.slug}/chapter/${item.lastReadChapter.number}`}
                        className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl hover:-translate-y-0.5 btn-press"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in rounded-3xl border-2 border-dashed border-stone-300 py-20 text-center">
            <div className="text-6xl">📜</div>
            <h3 className="mt-4 text-xl font-semibold text-stone-700">
              No reading history yet
            </h3>
            <p className="mt-2 text-stone-500">
              Start reading a novel and your progress will be tracked here
            </p>
            <Link
              href="/novels"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl"
            >
              Browse Novels
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