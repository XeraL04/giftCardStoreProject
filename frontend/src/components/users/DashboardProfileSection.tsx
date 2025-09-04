import { useAuthStore } from '../../app/store';
import { useEffect, useState, useRef } from 'react';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, ClipboardDocumentListIcon, StarIcon } from '@heroicons/react/24/solid';

export function DashboardProfileSection() {
  const { user } = useAuthStore();
  const [orderCount, setOrderCount] = useState(0);

  const [testimonialRating, setTestimonialRating] = useState(0);
  const [testimonialComment, setTestimonialComment] = useState('');
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);
  const [loadingTestimonial, setLoadingTestimonial] = useState(false);
  const [testimonialError, setTestimonialError] = useState<string | null>(null);

  const navigate = useNavigate();
  const commentRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    api
      .get('/orders/me')
      .then(res => setOrderCount(res.data.length))
      .catch(() => setOrderCount(0));
  }, []);

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
      commentRef.current?.focus();
    } catch (error: any) {
      setTestimonialError(error.response?.data?.message || 'Failed to submit testimonial');
    } finally {
      setLoadingTestimonial(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto my-3 bg-white/80 backdrop-blur-md border border-blue-50 rounded-3xl shadow-xl overflow-hidden">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 px-6 sm:px-8 py-10 text-white text-center">
        <div className="flex flex-col items-center max-w-xl mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center shadow-lg ring-2 ring-white/30 mb-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-12 h-12 sm:w-14 sm:h-14 text-white/90" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Welcome back, {user?.name || 'Friend'}!</h2>
          <p className="text-lg text-blue-100 max-w-md sm:max-w-2xl">
            This is your profile hub. Review orders, update your info, and share your experience!
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 sm:px-8 py-10">
        <div
          onClick={() => navigate('/orders')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/orders'); }}
          aria-label="My Orders"
          className="group bg-white/80 backdrop-blur-sm border border-blue-50 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer focus:ring-2 focus:ring-blue-400"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-fuchsia-500 group-hover:text-white transition">
            <ClipboardDocumentListIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="font-bold text-lg sm:text-xl mb-1 text-slate-900">My Orders</h3>
          <p className="text-gray-500 mb-2 text-base">{orderCount} order{orderCount === 1 ? '' : 's'}</p>
          <span className="text-blue-700 text-sm sm:text-base">View all your purchased gift cards</span>
        </div>

        <div
          onClick={() => navigate('/profile/edit')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/profile/edit'); }}
          aria-label="Edit Profile"
          className="group bg-white/80 backdrop-blur-sm border border-green-50 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer focus:ring-2 focus:ring-green-400"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-blue-500 group-hover:text-white transition">
            <UserCircleIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="font-bold text-lg sm:text-xl mb-1 text-slate-900">Edit Profile</h3>
          <p className="text-gray-500 mb-2 text-base">Update your info</p>
          <span className="text-green-700 text-sm sm:text-base">Change your name, email, phone and password</span>
        </div>
      </div>

      {/* Testimonial Form */}
      <div className="bg-white/90 backdrop-blur-sm border border-yellow-100 rounded-2xl sm:mx-8 mb-10 p-6 sm:p-8 max-w-4xl mx-auto">
        <h3 className="font-bold text-xl mb-4 text-center text-yellow-700 flex items-center justify-center gap-2">
          <span className="text-3xl">⭐</span> Share Your Experience
        </h3>

        {testimonialSubmitted ? (
          <p className="text-green-700 text-center font-semibold mb-4">
            Thank you for your testimonial!
          </p>
        ) : (
          <form onSubmit={handleSubmitTestimonial} className="flex flex-col gap-5">
            {/* Rating Stars */}
            <label htmlFor="rating" className="flex flex-col gap-1">
              <span className="font-semibold text-slate-700">Rating</span>
              <div className="flex gap-1 justify-center sm:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTestimonialRating(star)}
                    className="focus:outline-none"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <StarIcon
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        star <= testimonialRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </label>

            <label htmlFor="comment" className="flex flex-col gap-1">
              <span className="font-semibold text-slate-700">Comment</span>
              <textarea
                id="comment"
                ref={commentRef}
                value={testimonialComment}
                onChange={e => setTestimonialComment(e.target.value)}
                rows={4}
                required
                disabled={loadingTestimonial}
                placeholder="Tell us about your experience (at least 10 characters)…"
                className={`p-3 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  !isCommentValid && testimonialComment.length > 0 ? 'border-red-500' : 'border-yellow-200'
                }`}
              />
              {!isCommentValid && testimonialComment.length > 0 && (
                <small className="text-red-600">Please enter at least 10 characters.</small>
              )}
            </label>

            {testimonialError && (
              <p className="text-red-600 text-sm text-center">{testimonialError}</p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loadingTestimonial}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-orange-500 transition-all disabled:opacity-60"
            >
              {loadingTestimonial ? 'Submitting...' : 'Submit Testimonial'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
