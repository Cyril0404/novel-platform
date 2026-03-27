import { NovelGrid } from "@/components/novels/novel-grid";

export default function NovelsPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Browse Novels</h1>
          <p className="mt-2 text-stone-600">Discover amazing stories</p>
        </div>
        <NovelGrid />
      </div>
    </div>
  );
}
