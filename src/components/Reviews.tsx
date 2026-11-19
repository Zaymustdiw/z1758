import React, { useState, useEffect } from 'react';
import { Star, Trash2, MailWarning } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Review, Theme } from '../types';
import { sanitizeText, toMillis } from '../utils';

interface ReviewsProps {
  productId: string;
  theme: Theme;
}

export function Reviews({ productId, theme }: ReviewsProps) {
  const { user, isEmailVerified, isAdmin, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-zinc-100' : 'text-gray-800';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-zinc-800' : 'border-gray-200';
  const inputBg = isDark ? 'bg-zinc-800/50' : 'bg-gray-50';

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const snapshot = await getDocs(q);
      const fetched: Review[] = [];
      snapshot.forEach((d) => {
        fetched.push({ id: d.id, ...d.data() } as Review);
      });
      fetched.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      setReviews(fetched);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isEmailVerified) {
      openAuthModal();
      return;
    }
    const cleanComment = sanitizeText(comment, 2000);
    if (!cleanComment) return;

    const cleanRating = Math.min(5, Math.max(1, Math.round(rating)));
    const cleanName = sanitizeText(user.displayName || 'Anonymous', 100) || 'Anonymous';

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: cleanName,
        rating: cleanRating,
        comment: cleanComment,
        createdAt: serverTimestamp(),
      });
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!user || !isEmailVerified) return;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  return (
    <div className="mt-8">
      <h3 className={`text-xl font-bold mb-4 ${textColor}`}>Customer Reviews</h3>

      {/* Review Form */}
      <div className={`p-4 rounded-xl border mb-6 ${borderColor} ${inputBg}`}>
        {!user ? (
          <div className="text-center py-4">
            <p className={`mb-3 text-sm ${subTextColor}`}>Please sign in to leave a verified review</p>
            <button
              onClick={openAuthModal}
              className={`px-6 py-2 rounded-lg font-bold transition-opacity hover:opacity-90 cursor-pointer ${
                isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-950 text-white'
              }`}
            >
              Sign In
            </button>
          </div>
        ) : !isEmailVerified ? (
          <div className="text-center py-4 space-y-2">
            <MailWarning className="w-6 h-6 mx-auto text-amber-500" />
            <p className={`text-sm ${subTextColor}`}>Verify your email address to submit a review.</p>
            <button
              onClick={openAuthModal}
              className="px-5 py-2 rounded-lg font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 cursor-pointer"
            >
              Verify Email Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${subTextColor}`}>Your Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                      star <= rating
                        ? isDark
                          ? 'text-zinc-100 fill-zinc-100'
                          : 'text-zinc-950 fill-zinc-950'
                        : isDark
                        ? 'text-zinc-700'
                        : 'text-zinc-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              placeholder="Leave your review..."
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                isDark ? 'focus:ring-zinc-600 focus:border-zinc-500' : 'focus:ring-zinc-300 focus:border-zinc-900'
              } ${borderColor} ${inputBg} ${textColor}`}
              rows={3}
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className={`px-6 py-2 rounded-lg font-bold transition-opacity cursor-pointer ${
                submitting || !comment.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              } ${isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-950 text-white'}`}
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <p className={`text-sm ${subTextColor}`}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className={`text-sm ${subTextColor}`}>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => {
            const canDelete = isEmailVerified && (user?.uid === review.userId || isAdmin);
            return (
              <div key={review.id} className={`p-4 rounded-xl border ${borderColor}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`font-bold text-sm ${textColor}`}>{review.userName}</span>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? isDark
                                ? 'text-zinc-100 fill-zinc-100'
                                : 'text-zinc-950 fill-zinc-950'
                              : isDark
                              ? 'text-zinc-700'
                              : 'text-zinc-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${subTextColor}`}>
                      {toMillis(review.createdAt)
                        ? new Date(toMillis(review.createdAt)).toLocaleDateString()
                        : 'Just now'}
                    </span>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1 text-red-400 hover:text-red-500 cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className={`text-sm ${textColor}`}>{review.comment}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
