"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SkeletonBookshelf } from "@/components/ui/skeleton";

interface BookshelfItem {
  id: string;
  status: string;
  novel: {
    id: string;
    slug: string;
    title: string;
    cover: string;
    author: { name: string };
    genres: { name: string }[];
    _count: { chapters: number };
  };
  hasNewChapters?: boolean;
  newChapterCount?: number;
  latestChapterNumber?: number;
}

const statusLabels: Record<string, string> = {
  READING: "Reading",
  COMPLETED: "Completed",
  PLAN_TO_READ: "Plan to Read",
  ON_HOLD: "On Hold",
  DROPPED: "Dropped",
};

const statusColors: Record<string, string> = {
  READING: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  COMPLETED: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
  PLAN_TO_READ: "bg-gradient-to-r from-stone-400 to-stone-500 text-white",
  ON_HOLD: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
  DROPPED: "bg-gradient-to-r from-red-500 to-red-600 text-white",
};

export default function BookshelfPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<BookshelfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BookshelfItem | null>(null);

  useEffect(() => {
    async function fetchBookshelf() {
      try {
        const res = await fetch("/api/bookshelf");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch bookshelf:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }
    fetchBookshelf();
  }, []);

  const handleDelete = async (novelId: string) => {
    if (!confirm("Remove this novel from your bookshelf?")) return;

    try {
      await fetch(`/api/bookshelf?novelId=${novelId}`, { method: "DELETE" });
      setItems(items.filter((item) => item.novel.id !== novelId));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedItem) return;

    try {
      await fetch("/api/bookshelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          novelId: selectedItem.novel.id,
          status: newStatus,
        }),
      });

      setItems(
        items.map((item) =>
          item.id === selectedItem.id ? { ...item, status: newStatus } : item
        )
      );
      setShowStatusModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const openStatusModal = (item: BookshelfItem) => {
    setSelectedItem(item);
    setShowStatusModal(true);
  };

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.status === filter.toUpperCase());

  const statusCounts = {
    all: items.length,
    reading: items.filter((i) => i.status === "READING").length,
    completed: items.filter((i) => i.status === "COMPLETED").length,
    plan: items.filter((i) => i.status === "PLAN_TO_READ").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-stone-200" />
          </div>
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-gradient-to-r from-stone-100 to-stone-200" />
            ))}
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
          <h1 className="text-3xl font-bold text-stone-900">My Bookshelf</h1>
          <p className="mt-2 text-stone-600">
            {session
              ? `Welcome back, ${session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}`
              : "Sign in to sync your bookshelf"}{" "}
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-sm font-medium text-amber-700">
              {items.length} novels
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { key: "all", label: "Total", color: "from-stone-500 to-stone-600", count: statusCounts.all },
            { key: "reading", label: "Reading", color: "from-blue-500 to-blue-600", count: statusCounts.reading },
            { key: "completed", label: "Completed", color: "from-emerald-500 to-emerald-600", count: statusCounts.completed },
          ].map(({ key, label, color, count }, i) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`animate-fade-in-up rounded-2xl bg-gradient-to-r ${color} p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl opacity-0 ${
                filter === key ? "ring-4 ring-white ring-offset-2" : ""
              }`}
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
            >
              <p className="text-3xl font-bold text-white">{count}</p>
              <p className="mt-1 text-sm font-medium text-white/80">{label}</p>
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-200 pb-4">
          {[
            { key: "all", label: `All`, count: statusCounts.all },
            { key: "reading", label: `Reading`, count: statusCounts.reading },
            { key: "completed", label: `Completed`, count: statusCounts.completed },
            { key: "plan", label: `Plan to Read`, count: statusCounts.plan },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === key
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Bookshelf Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
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
                    <span className={`absolute -top-2 -right-2 rounded-full ${statusColors[item.status]} px-2 py-0.5 text-xs font-semibold shadow-lg`}>
                      {statusLabels[item.status]}
                    </span>
                    {item.hasNewChapters && (
                      <span className="absolute -top-2 -left-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-xs font-semibold text-white shadow-lg animate-bounce-soft">
                        {item.newChapterCount} new
                      </span>
                    )}
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
                      <button
                        onClick={() => handleDelete(item.novel.id)}
                        className="rounded-xl p-2 text-stone-400 transition-all hover:bg-red-50 hover:text-red-500"
                        title="Remove from bookshelf"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <p className="text-xs text-stone-400">
                        {item.novel._count.chapters} chapters
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/novel/${item.novel.slug}/chapter/1`}
                          className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl hover:-translate-y-0.5 btn-press"
                        >
                          Start Reading
                        </Link>
                        <button
                          onClick={() => openStatusModal(item)}
                          className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm transition-all hover:border-amber-300 hover:text-amber-600"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in rounded-3xl border-2 border-dashed border-stone-300 py-20 text-center">
            <div className="text-6xl">📚</div>
            <h3 className="mt-4 text-xl font-semibold text-stone-700">
              {filter === "all" ? "Your bookshelf is empty" : "No novels in this category"}
            </h3>
            <p className="mt-2 text-stone-500">
              {filter === "all"
                ? "Start exploring novels and add them to your bookshelf"
                : "Try selecting a different filter"}
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

      {/* Status Modal */}
      {showStatusModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-stone-900">Update Reading Status</h3>
            <p className="mt-1 text-sm text-stone-500 line-clamp-1">{selectedItem.novel.title}</p>

            <div className="mt-6 space-y-2">
              {Object.entries(statusLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  className={`w-full rounded-xl px-4 py-3 text-left font-medium transition-all ${
                    selectedItem.status === key
                      ? `${statusColors[key]} shadow-lg`
                      : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedItem(null);
              }}
              className="mt-4 w-full rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
