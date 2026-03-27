"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Reviews } from "@/components/reviews";
import { Recommendations } from "@/components/recommendations";

interface Chapter {
  id: string;
  number: number;
  title: string;
  wordCount: number;
}

interface NovelData {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  cover: string;
  status: string;
  rating: number;
  totalRatings: number;
  views: number;
  author: { name: string; bio: string };
  genres: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  chapters: Chapter[];
  _count: { chapters: number };
}

interface ReadingProgress {
  chapterNumber: number;
  percentage: number;
}

export default function NovelDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session } = useSession();
  const [novel, setNovel] = useState<NovelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastProgress, setLastProgress] = useState<ReadingProgress | null>(null);
  const [chapterSort, setChapterSort] = useState<"desc" | "asc">("desc");
  const [showChapterJump, setShowChapterJump] = useState(false);
  const [jumpToChapter, setJumpToChapter] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch novel data
        const novelRes = await fetch(`/api/novels?slug=${params.slug}`);
        const novelData = await novelRes.json();

        if (novelData.length > 0) {
          setNovel(novelData[0]);
        }

        // Fetch reading progress
        if (session?.user) {
          const progressRes = await fetch("/api/progress");
          const allProgress = await progressRes.json();

          // Find progress for this novel
          const novelProgress = allProgress
            .filter((p: any) => p.chapter?.novel?.slug === params.slug)
            .sort((a: any, b: any) => b.updatedAt.localeCompare(a.updatedAt))[0];

          if (novelProgress) {
            setLastProgress({
              chapterNumber: novelProgress.chapterNumber,
              percentage: novelProgress.percentage,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.slug, session]);

  const statusColors: Record<string, string> = {
    ONGOING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    HIATUS: "bg-yellow-100 text-yellow-700",
    DROPPED: "bg-red-100 text-red-700",
  };

  const handleJumpToChapter = () => {
    const chapterNum = parseInt(jumpToChapter);
    if (chapterNum && novel && chapterNum >= 1 && chapterNum <= novel._count.chapters) {
      window.location.href = `/novel/${params.slug}/chapter/${chapterNum}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="animate-pulse">
            <div className="h-4 w-48 rounded bg-stone-200" />
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="aspect-[3/4] rounded-xl bg-stone-200" />
              <div className="lg:col-span-2 space-y-4">
                <div className="h-10 w-3/4 rounded bg-stone-200" />
                <div className="h-6 w-1/2 rounded bg-stone-200" />
                <div className="h-20 rounded bg-stone-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-2xl font-bold text-stone-900">Novel not found</h1>
          <Link href="/novels" className="mt-4 text-amber-600 hover:underline">
            Back to novels
          </Link>
        </div>
      </div>
    );
  }

  const sortedChapters = [...novel.chapters].sort((a, b) =>
    chapterSort === "desc" ? b.number - a.number : a.number - b.number
  );

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-amber-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/novels" className="hover:text-amber-600">
            Novels
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-900">{novel.title}</span>
        </nav>

        {/* Novel Header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 overflow-hidden rounded-xl bg-white shadow-lg">
              <img src={novel.cover} alt={novel.title} className="w-full" />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[novel.status]}`}
                >
                  {novel.status}
                </span>
                {novel.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <button className="rounded-full border-2 border-stone-300 p-2 text-stone-400 hover:border-amber-600 hover:text-amber-600 transition-colors">
                ❤️
              </button>
            </div>

            <h1 className="mt-4 text-4xl font-bold text-stone-900">
              {novel.title}
            </h1>
            <p className="mt-2 text-lg text-stone-600">by {novel.author.name}</p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-6 border-y border-stone-200 py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  ⭐ {novel.rating.toFixed(1)}
                </p>
                <p className="text-sm text-stone-500">
                  {novel.totalRatings.toLocaleString()} ratings
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-700">
                  {novel._count.chapters}
                </p>
                <p className="text-sm text-stone-500">Chapters</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-700">
                  {(novel.views / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-stone-500">Views</p>
              </div>
            </div>

            {/* Reading Progress */}
            {lastProgress && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-700">Your Progress</span>
                  <span className="text-sm text-emerald-600">Chapter {lastProgress.chapterNumber}</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${lastProgress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <Link
                href={`/novel/${novel.slug}/chapter/1`}
                className="flex-1 rounded-full bg-amber-600 px-6 py-3 text-center font-medium text-white hover:bg-amber-700 transition-colors"
              >
                Start Reading
              </Link>
              {lastProgress ? (
                <Link
                  href={`/novel/${novel.slug}/chapter/${lastProgress.chapterNumber}`}
                  className="flex-1 rounded-full border-2 border-emerald-600 px-6 py-3 text-center font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  Continue (Ch. {lastProgress.chapterNumber})
                </Link>
              ) : (
                <Link
                  href={`/novel/${novel.slug}/chapter/${novel._count.chapters}`}
                  className="flex-1 rounded-full border-2 border-amber-600 px-6 py-3 text-center font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  Latest Chapter
                </Link>
              )}
            </div>

            {/* Synopsis */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-stone-900">Synopsis</h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                {novel.synopsis.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {novel.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600 hover:bg-amber-100 hover:text-amber-700 cursor-pointer transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>

            {/* Author */}
            <div className="mt-8 rounded-xl bg-stone-50 p-6">
              <h3 className="font-semibold text-stone-900">About the Author</h3>
              <p className="mt-2 text-stone-600">{novel.author.bio || "No bio available."}</p>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
              Chapters ({novel._count.chapters})
            </h2>
            <div className="flex items-center gap-4">
              {/* Jump to Chapter */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={novel._count.chapters}
                  placeholder="Ch #"
                  value={jumpToChapter}
                  onChange={(e) => setJumpToChapter(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJumpToChapter()}
                  className="w-20 rounded-lg border border-stone-300 px-3 py-1 text-sm focus:border-amber-500 focus:outline-none"
                />
                <button
                  onClick={handleJumpToChapter}
                  className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 hover:bg-amber-200 transition-colors"
                >
                  Go
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setChapterSort("desc")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    chapterSort === "desc"
                      ? "bg-amber-100 text-amber-700"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setChapterSort("asc")}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    chapterSort === "asc"
                      ? "bg-amber-100 text-amber-700"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 divide-y divide-stone-200 rounded-xl bg-white shadow-sm">
            {sortedChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/novel/${novel.slug}/chapter/${chapter.number}`}
                className={`flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors ${
                  lastProgress && chapter.number === lastProgress.chapterNumber
                    ? "bg-emerald-50 border-l-4 border-emerald-500"
                    : ""
                }`}
              >
                <div>
                  <p className="font-medium text-stone-900">
                    Chapter {chapter.number}: {chapter.title}
                    {lastProgress && chapter.number === lastProgress.chapterNumber && (
                      <span className="ml-2 text-xs text-emerald-600 font-medium">(Reading)</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {chapter.wordCount.toLocaleString()} words
                  </p>
                </div>
                <span className="text-stone-400">→</span>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {novel._count.chapters > 20 && (
            <div className="mt-6 text-center">
              <button className="rounded-full border-2 border-stone-300 px-8 py-2 text-stone-600 hover:border-amber-600 hover:text-amber-600 transition-colors">
                Load More Chapters
              </button>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <Reviews
          novelId={novel.id}
          novelSlug={novel.slug}
          initialRating={novel.rating}
          initialTotalRatings={novel.totalRatings}
        />

        {/* Recommendations Section */}
        <Recommendations novelId={novel.id} />
      </div>
    </div>
  );
}
