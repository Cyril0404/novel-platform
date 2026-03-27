"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

interface SearchResult {
  novels: Array<{
    id: string;
    slug: string;
    title: string;
    cover: string;
    author: { name: string };
  }>;
  authors: Array<{
    id: string;
    slug: string;
    name: string;
    avatar: string | null;
  }>;
}

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 hidden border-b border-stone-200/50 bg-white/80 backdrop-blur-xl md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
              NovelFlow
            </span>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="relative mx-8 flex-1 max-w-xl">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                  placeholder="Search novels or authors..."
                  className="w-full rounded-full border border-stone-200 bg-stone-50 px-5 py-2.5 pl-12 text-sm focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  {isSearching ? (
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </span>
              </div>
            </form>

            {/* Search Dropdown */}
            {showDropdown && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden animate-scale-in">
                {searchResults.novels.length === 0 && searchResults.authors.length === 0 ? (
                  <div className="p-4 text-center text-stone-500">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <>
                    {searchResults.novels.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                          Novels
                        </div>
                        {searchResults.novels.map((novel) => (
                          <Link
                            key={novel.id}
                            href={`/novel/${novel.slug}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                          >
                            <img src={novel.cover} alt={novel.title} className="h-12 w-10 rounded object-cover" />
                            <div>
                              <p className="font-medium text-stone-900 line-clamp-1">{novel.title}</p>
                              <p className="text-sm text-stone-500">{novel.author.name}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.authors.length > 0 && (
                      <div className={searchResults.novels.length > 0 ? "border-t border-stone-100" : ""}>
                        <div className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                          Authors
                        </div>
                        {searchResults.authors.map((author) => (
                          <Link
                            key={author.id}
                            href={`/author/${author.slug}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                          >
                            {author.avatar ? (
                              <img src={author.avatar} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold">
                                {author.name.charAt(0)}
                              </div>
                            )}
                            <p className="font-medium text-stone-900">{author.name}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center justify-center gap-2 border-t border-stone-100 px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      View all results
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <nav className="flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/novels", label: "Browse" },
              { href: "/bookshelf", label: "Bookshelf" },
              { href: "/history", label: "History" },
            ].map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-amber-100 text-amber-700"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 rounded-xl p-2.5 text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            {status === "loading" ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-stone-200" />
            ) : session ? (
              <div className="ml-4 flex items-center gap-3">
                <span className="text-sm text-stone-600">
                  {session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm transition-all hover:border-red-300 hover:text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="ml-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-amber-200 btn-press"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="glass sticky top-0 z-50 border-b border-stone-200/50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text font-bold text-transparent">
              NovelFlow
            </span>
          </Link>
          {status === "authenticated" ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">
                {session?.user?.name?.split(" ")[0]}
              </span>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white"
            >
              Sign In
            </Link>
          )}
        </div>
        {/* Mobile Search */}
        <div className="px-4 pb-3">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
            />
          </form>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="glass fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200/50 pb-safe md:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { href: "/", icon: "🏠", label: "Home" },
            { href: "/novels", icon: "📚", label: "Browse" },
            { href: "/bookshelf", icon: "📖", label: "Bookshelf" },
            { href: "/history", icon: "📜", label: "History" },
            { href: "/auth/signin", icon: "👤", label: "Profile" },
          ].map(({ href, icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all ${
                  isActive
                    ? "text-amber-600"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium">{label}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 h-1 w-8 rounded-full bg-amber-600" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}