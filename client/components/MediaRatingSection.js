'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Send, MessageSquare } from 'lucide-react';
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
    reviews: [],
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const [hoverStar,      setHoverStar]      = useState(0);
  const [selectedStars,  setSelectedStars]  = useState(5);
  const [selectedThumb,  setSelectedThumb]  = useState('up');
  const [reviewText,     setReviewText]     = useState('');
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const fetchRatings = async () => {
    if (!mediaId) return;
    try {
      const res  = await fetch(`/api/ratings/${mediaId}`);
      const data = await res.json();
      if (data.success) {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        (data.reviews || []).forEach(r => { if (dist[r.stars] !== undefined) dist[r.stars]++; });
        setRatingData({
          avgStars:    data.avgStars    || 4.8,
          totalReviews: data.totalReviews || 0,
          thumbsUp:    data.thumbsUp    || 0,
          thumbsDown:  data.thumbsDown  || 0,
          reviews:     data.reviews     || [],
          distribution: dist,
        });
        if (user && data.reviews) {
          const found = data.reviews.some(r => r.userId === user._id || r.userName === user.name);
          if (found) setUserHasReviewed(true);
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchRatings(); }, [mediaId, user]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to leave a rating!'); return; }
    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/api/ratings/${mediaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars: selectedStars, thumbs: selectedThumb, review: reviewText, mediaType }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Rating submitted! Thank you!', {
          style: { background: '#0b0f0a', color: '#a7c957', border: '1px solid #a7c957' },
        });
        setReviewText('');
        setUserHasReviewed(true);
        fetchRatings();
      } else {
        toast.error(data.message || 'Failed to submit rating');
      }
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxDist = Math.max(...Object.values(ratingData.distribution), 1);

  return (
    <section className="w-full rounded-3xl bg-white/4 border border-white/8 overflow-hidden">

      {/* Header */}
      <div className="px-6 md:px-8 pt-7 pb-5 border-b border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#a7c957] uppercase tracking-widest block mb-1">
            Community Feedback
          </span>
          <h3 className="text-2xl font-black text-white">Fan Ratings & Reviews</h3>
          <p className="text-gray-400 text-sm mt-0.5">
            See what other fans think about {title}
          </p>
        </div>

        {/* Score badge */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
          <div>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-black text-white leading-none">{ratingData.avgStars}</span>
              <span className="text-gray-400 text-sm mb-1">/5</span>
            </div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} className="text-[#a7c957]"
                  fill={s <= Math.round(ratingData.avgStars) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-1">from {ratingData.totalReviews} verified ratings</p>
          </div>

          {/* Distribution bars */}
          <div className="space-y-1 min-w-[110px]">
            {[5,4,3,2,1].map(star => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-3">{star}</span>
                <Star size={9} className="text-[#a7c957]" fill="currentColor" />
                <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#a7c957] rounded-full transition-all duration-700"
                    style={{ width: `${(ratingData.distribution[star] / maxDist) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-3">{ratingData.distribution[star]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout: reviews list + post form */}
      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/8">

        {/* Left: reviews list */}
        <div className="px-6 md:px-8 py-6 space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={13} />
            Recent Reviews ({ratingData.reviews.length})
          </h4>

          {ratingData.reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MessageSquare size={40} className="text-white/10 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No reviews yet.</p>
              <p className="text-gray-600 text-xs mt-1">Be the first to review {title} and help other fans!</p>
            </div>
          ) : (
            ratingData.reviews.map((rev, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-9 h-9 rounded-full bg-[#a7c957]/15 border border-[#a7c957]/30 text-[#a7c957] font-black text-sm flex items-center justify-center flex-shrink-0">
                  {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rev.userName}</span>
                      {rev.thumbs === 'up' && (
                        <span className="text-[10px] text-[#a7c957] flex items-center gap-0.5">
                          <ThumbsUp size={9} /> Recommends
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-[#a7c957]">
                      {Array.from({ length: rev.stars }).map((_, si) => (
                        <Star key={si} size={10} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  {rev.review && (
                    <p className="text-xs text-gray-400 leading-relaxed">{rev.review}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: post review form */}
        <div className="px-6 md:px-8 py-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[#a7c957]/15 border border-[#a7c957]/30 flex items-center justify-center">
              <Star size={13} className="text-[#a7c957]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Share Your Thoughts</h4>
              <p className="text-gray-400 text-xs">Rate this movie and let other fans know what you think.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitRating} className="space-y-5">
            {/* Star picker */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoverStar(star)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setSelectedStars(star)}
                    className="transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      size={26}
                      className={(hoverStar || selectedStars) >= star ? 'text-[#a7c957]' : 'text-gray-600'}
                      fill={(hoverStar || selectedStars) >= star ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbs */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Recommendation
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedThumb('up')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                    selectedThumb === 'up'
                      ? 'bg-[#a7c957] text-[#0b0f0a] border-[#a7c957]'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ThumbsUp size={14} /> Recommend
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedThumb('down')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                    selectedThumb === 'down'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ThumbsDown size={14} /> Skip
                </button>
              </div>
            </div>

            {/* Review text */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Write a Review (optional)
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={`Share your thoughts on ${title}…`}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#a7c957]/40 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#a7c957] text-[#0b0f0a] font-black text-sm tracking-wide hover:bg-[#95b347] hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(167,201,87,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              <Send size={14} />
              {isSubmitting ? 'Posting…' : 'Post Review'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
