import { useAuthStore } from '../../app/store';
import { useEffect, useState, useRef } from 'react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';

export function DashboardProfileSection() {
  const { user } = useAuthStore();
  const [orderCount, setOrderCount] = useState(0);

  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialComment, setTestimonialComment] = useState('');
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);
  const [loadingTestimonial, setLoadingTestimonial] = useState(false);
  const [testimonialError, setTestimonialError] = useState<string | null>(null);

  const navigate = useNavigate();
  const commentRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    api.get('/orders/me')
      .then(res => setOrderCount(res.data.length))
      .catch(() => setOrderCount(0));
  }, []);

  // Validation checks
  const isCommentValid = testimonialComment.trim().length >= 10;
  const isFormValid = isCommentValid && testimonialRating >= 1 && testimonialRating <= 5;

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoadingTestimonial(true);
    setTestimonialError(null);
    try {
      await api.post('/testimonials', {
        rating: testimonialRating,
        comment: testimonialComment.trim(),
      });
      setTestimonialSubmitted(true);
      setTestimonialComment('');
      setTestimonialRating(5);
      // Optionally return focus to comment field
      commentRef.current?.focus();
    } catch (error: any) {
      setTestimonialError(error.response?.data?.message || 'Failed to submit testimonial');
    } finally {
      setLoadingTestimonial(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-lg shadow mt-12 mb-16 overflow-hidden">
      {/* Section 1: Welcome / Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-8 py-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Friend'}!</h2>
        <p className="text-lg opacity-90">
          This is your profile area. Here, you can review your orders, update your info, and share your experience with us!
        </p>
      </div>

      {/* Sections 2 & 3: Cards side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-10">
        <div
          className="bg-blue-50 rounded-lg p-6 flex flex-col items-center shadow hover:shadow-lg cursor-pointer transition"
          onClick={() => navigate('/orders')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/orders'); }}
          aria-label="My Orders"
        >
          <span className="text-blue-600 text-4xl mb-2">📦</span>
          <div className="font-bold text-xl mb-1">My Orders</div>
          <div className="text-gray-500 mb-2 text-lg">{orderCount} order{orderCount === 1 ? '' : 's'}</div>
          <div className="text-blue-700 text-sm">View all your purchased gift cards</div>
        </div>

        <div
          className="bg-green-50 rounded-lg p-6 flex flex-col items-center shadow hover:shadow-lg cursor-pointer transition"
          onClick={() => navigate('/profile/edit')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/profile/edit'); }}
          aria-label="Edit Profile"
        >
          <span className="text-green-600 text-4xl mb-2">👤</span>
          <div className="font-bold text-xl mb-1">Edit Profile</div>
          <div className="text-gray-500 mb-2 text-lg">Update your info</div>
          <div className="text-green-700 text-sm">Change your name, email, phone number and password</div>
        </div>
      </div>

      {/* Section 4: Share Your Experience Form (full width below cards) */}
      <div className="bg-yellow-50 rounded-lg p-6 mb-8 shadow max-w-lg mx-auto">
        <h3 className="font-bold text-xl mb-4 text-center text-yellow-700 flex items-center justify-center gap-2">
          <span className="text-4xl">⭐</span> Share Your Experience
        </h3>

        {testimonialSubmitted ? (
          <p className="text-green-700 text-center font-semibold mb-4">
            Thank you for your testimonial!
          </p>
        ) : (
          <form onSubmit={handleSubmitTestimonial} className="flex flex-col gap-4">
            <label htmlFor="rating" className="flex flex-col gap-1">
              <span className="font-semibold">Rating</span>
              <select
                id="rating"
                value={testimonialRating}
                onChange={(e) => setTestimonialRating(Number(e.target.value))}
                required
                className="p-2 rounded border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-invalid={!isFormValid}
                aria-describedby="rating-desc"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} {r === 1 ? 'star' : 'stars'}</option>
                ))}
              </select>
              <small className="text-gray-600" id="rating-desc">Select a rating from 1 to 5 stars</small>
            </label>

            <label htmlFor="comment" className="flex flex-col gap-1">
              <span className="font-semibold">Comment</span>
              <textarea
                id="comment"
                ref={commentRef}
                value={testimonialComment}
                onChange={e => setTestimonialComment(e.target.value)}
                rows={4}
                required
                disabled={loadingTestimonial}
                placeholder="Tell us about your experience (at least 10 characters)…"
                className={`p-2 rounded border resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  !isCommentValid && testimonialComment.length > 0 ? 'border-red-500' : ''
                }`}
                aria-invalid={!isCommentValid}
                aria-describedby="comment-error"
              />
              {!isCommentValid && testimonialComment.length > 0 && (
                <small id="comment-error" className="text-red-600">Please enter at least 10 characters.</small>
              )}
            </label>

            {testimonialError && (
              <p className="text-red-600 text-sm text-center">{testimonialError}</p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loadingTestimonial}
              className={`bg-yellow-400 text-white py-2 rounded font-semibold hover:bg-yellow-500 transition disabled:opacity-60`}
              aria-busy={loadingTestimonial}
            >
              {loadingTestimonial ? (
                <span className="flex justify-center items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : ('Submit Testimonial')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
