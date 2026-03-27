"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
  user: {
    name: string | null;
    avatar: string | null;
  };
}

interface ReviewsProps {
  novelId: string;
  novelSlug: string;
  initialRating?: number;
  initialTotalRatings?: number;
}

export function Reviews({ novelId, novelSlug, initialRating = 0, initialTotalRatings = 0 }: ReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [avgRating, setAvgRating] = useState(initialRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);

  useEffect(() => {
    fetchReviews();
  }, [novelId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?novelId=${novelId}`);
      const data = await res.json();
      setReviews(data);

      // Check if current user has reviewed
      if (session?.user?.email) {
        const userReview = data.find((r: Review) => r.user.name === session.user?.name);
        if (userReview) {
          setHasReviewed(true);
          setUserRating(userReview.rating);
          setReviewContent(userReview.content || "");
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!session) {
      alert("Please sign in to leave a review");
      return;
    }

    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          novelId,
          rating: userRating,
          content: reviewContent || null,
        }),
      });

      if (res.ok) {
        setHasReviewed(true);
        // Update local rating display
        const newTotal = hasReviewed ? totalRatings : totalRatings + 1;
        const newAvg = hasReviewed
          ? (avgRating * totalRatings - (hasReviewed ? userRating : 0) + userRating) / totalRatings
          : (avgRating * totalRatings + userRating) / (totalRatings + 1);
        setAvgRating(newAvg);
        setTotalRatings(newTotal);
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`text-2xl transition-all ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} ${
              star <= (interactive ? (hoverRating || userRating) : rating)
                ? "text-amber-400"
                : "text-stone-300"
            }`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 border-t border-stone-200 pt-8">
      <h2 className="text-2xl font-bold text-stone-900">Reviews & Ratings</h2>

      {/* Rating Summary */}
      <div className="mt-6 flex items-center gap-8">
        <div className="text-center">
          <p className="text-5xl font-bold text-amber-500">{avgRating.toFixed(1)}</p>
          <p className="mt-1 text-sm text-stone-500">{renderStars(avgRating)}</p>
          <p className="mt-1 text-sm text-stone-500">{totalRatings.toLocaleString()} ratings</p>
        </div>
      </div>

      {/* Write Review */}
      <div className="mt-8 rounded-2xl bg-stone-50 p-6">
        <h3 className="font-semibold text-stone-900">
          {session ? (hasReviewed ? "Update Your Review" : "Write a Review") : "Sign in to write a review"}
        </h3>

        {session && (
          <div className="mt-4">
            <div className="mb-4">
              <label className="text-sm font-medium text-stone-700">Your Rating</label>
              <div className="mt-2">
                {renderStars(userRating, !hasReviewed)}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-stone-700">Your Review (optional)</label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Share your thoughts about this novel..."
                className="mt-2 w-full rounded-xl border border-stone-300 p-3 focus:border-amber-500 focus:outline-none"
                rows={4}
              />
            </div>

            <button
              onClick={submitReview}
              disabled={isSubmitting || userRating === 0}
              className={`rounded-xl px-6 py-2.5 font-medium transition-all ${
                isSubmitting || userRating === 0
                  ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-200"
              }`}
            >
              {isSubmitting ? "Submitting..." : hasReviewed ? "Update Review" : "Submit Review"}
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl bg-stone-100 p-4 h-24" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl bg-stone-50 p-8 text-center">
            <p className="text-stone-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-white p-6 shadow-sm border border-stone-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                    {review.user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{review.user.name || "Anonymous"}</p>
                    <div className="mt-1">{renderStars(review.rating)}</div>
                  </div>
                </div>
                <span className="text-sm text-stone-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.content && (
                <p className="mt-4 text-stone-600 leading-relaxed">{review.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
