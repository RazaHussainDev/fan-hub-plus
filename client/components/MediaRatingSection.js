'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send, CheckCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/apiClient';
import toast from 'react-hot-toast';

export default function MediaRatingSection({ mediaId, mediaType = 'movie', title = 'This Content' }) {
  const { user } = useAuth();
  const [ratingData, setRatingData] = useState({
    avgStars: 4.8,
    totalReviews: 0,
    thumbsUp: 0,
    thumbsDown: 0,
    reviews: []
  });

  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStars, setSelectedStars] = useState(5);
  const [selectedThumb, setSelectedThumb] = useState('up');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const fetchRatings = async () => {
    if (!mediaId) return;
    try {
      const res = await fetch(`/api/ratings/${mediaId}`);
      const data = await res.json();
      if (data.success) {
        setRatingData({
          avgStars: data.avgStars || 4.8,
          totalReviews: data.totalReviews || 0,
          thumbsUp: data.thumbsUp || 0,
          thumbsDown: data.thumbsDown || 0,
          reviews: data.reviews || []
        });

        if (user && data.reviews) {
          const found = data.reviews.some(r => r.userId === user._id || r.userName === user.name);
          if (found) setUserHasReviewed(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [mediaId, user]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a rating and review!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/api/ratings/${mediaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stars: selectedStars,
          thumbs: selectedThumb,
          review: reviewText,
          mediaType
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Rating submitted! Thank you for supporting the fandom.", {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' }
        });
        setReviewText('');
        setUserHasReviewed(true);
        fetchRatings();
      } else {
        toast.error(data.message || "Failed to submit rating");
      }
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full mt-10 p-6 md:p-8 rounded-3xl bg-white/70 dark:bg-[#0c100a]/80 border border-black/5 dark:border-white/10 backdrop-blur-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="text-[11px] font-bold text-[#a7c957] uppercase tracking-widest block mb-1">
            Community Feedback & Audience Score
          </span>
          <h3 className="text-2xl font-heading font-black text-gray-900 dark:text-white">
            Fan Ratings & Reviews
          </h3>
        </div>

        {/* Score Summary Badge */}
        <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 px-4 py-2.5 rounded-2xl border border-black/5 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <Star size={24} className="text-[#a7c957]" fill="currentColor" />
            <span className="text-2xl font-black font-heading text-gray-900 dark:text-white">
              {ratingData.avgStars}
            </span>
            <span className="text-xs text-gray-500 font-semibold self-end mb-1">/ 5.0</span>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <div className="text-xs text-gray-400">
            <strong className="text-white block font-bold">{ratingData.totalReviews}</strong>
            <span>Verified Ratings</span>
          </div>
        </div>
      </div>

      {/* Submit Rating Form */}
      <form onSubmit={handleSubmitRating} className="mt-6 p-5 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => setSelectedStars(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    size={22}
                    className={
                      (hoverStar || selectedStars) >= star
                        ? 'text-[#a7c957]'
                        : 'text-gray-600'
                    }
                    fill={(hoverStar || selectedStars) >= star ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-[#a7c957]">
                {selectedStars} Star{selectedStars > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Quick Thumbs Reaction */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 mr-1">Recommendation:</span>
            <button
              type="button"
              onClick={() => setSelectedThumb('up')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedThumb === 'up'
                  ? 'bg-[#a7c957] text-[#0b0f0a]'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <ThumbsUp size={13} /> Recommended
            </button>

            <button
              type="button"
              onClick={() => setSelectedThumb('down')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedThumb === 'down'
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <ThumbsDown size={13} /> Skip
            </button>
          </div>
        </div>

        {/* Optional Review Text */}
        <div className="flex gap-2">
          <input
            type="text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={`Share your thoughts on ${title}... (optional)`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/10 dark:bg-black/30 border border-black/10 dark:border-white/10 text-xs md:text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/50"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#a7c957] text-[#0b0f0a] font-bold text-xs md:text-sm hover:scale-105 transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send size={14} /> {isSubmitting ? 'Posting...' : 'Post Rating'}
          </button>
        </div>
      </form>

      {/* Reviews Stream */}
      <div className="mt-8 space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Recent Community Reviews ({ratingData.reviews.length})
        </h4>

        {ratingData.reviews.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 italic text-center">
            No text reviews yet. Be the first to rate and review!
          </p>
        ) : (
          ratingData.reviews.map((rev, i) => (
            <div key={i} className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#a7c957]/20 border border-[#a7c957]/40 text-[#a7c957] font-bold text-xs flex items-center justify-center flex-shrink-0">
                {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {rev.userName}
                    </span>
                    {rev.thumbs === 'up' && (
                      <span className="text-[10px] text-[#a7c957] font-semibold flex items-center gap-0.5">
                        <ThumbsUp size={10} /> Recommends
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-[#a7c957]">
                    {Array.from({ length: rev.stars }).map((_, si) => (
                      <Star key={si} size={11} fill="currentColor" />
                    ))}
                  </div>
                </div>

                {rev.review && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {rev.review}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
