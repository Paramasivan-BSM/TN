import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import BookingModal from './BookingModal';
import MessageModal from './MessageModal';
import { fetchReviews, postReview, replyToReview, clearReviewState } from '../services/reviewSlice';
import api from '../../../api';
import '../../user/components/DetailedWorkerPage.css';

const Star = ({ filled, onClick }) => (
    <span
        onClick={onClick}
        style={{ cursor: 'pointer', fontSize: '1.5rem', color: filled ? '#f59e0b' : '#334155' }}
    >★</span>
);

// ─── Toast component ──────────────────────────────────────────────────────────
const Toast = ({ message, type, onDone }) => {
    useEffect(() => {
        const timer = setTimeout(onDone, 3000);
        return () => clearTimeout(timer);
    }, [onDone]);
    return (
        <div className={`dwp-toast dwp-toast-${type}`}>
            {type === 'success' ? '✅' : '❌'} {message}
        </div>
    );
};

const DetailedWorkerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [portfolioImages, setPortfolioImages] = useState([]);
    const [lightboxImg, setLightboxImg] = useState(null);

    // Review form state
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Reply state (per-review)
    const [replyingTo, setReplyingTo] = useState(null);   // reviewId
    const [replyText, setReplyText] = useState('');

    // Toast
    const [toast, setToast] = useState(null); // { message, type }
    const showToast = (message, type = 'success') => setToast({ message, type });

    const { workers } = useSelector((state) => state.location || { workers: [] });
    const { role, email, isAuthenticated } = useSelector((state) => state.auth);
    const { reviews, loading: reviewsLoading, submitLoading, replyLoading, error: reviewError, successMessage } =
        useSelector((state) => state.reviews);

    const worker = location.state?.worker
        || workers.find(w => w.name === id)
        || { name: id || "Worker", skill: "Professional", available: true, serviceRadiusKm: 10 };

    const workerId = worker?.id || worker?._id || "";

    // Fetch real reviews & portfolio on mount
    useEffect(() => {
        if (workerId) {
            dispatch(fetchReviews(workerId));
            api.get(`/portfolio/${workerId}`)
                .then(res => setPortfolioImages(res.data || []))
                .catch(() => setPortfolioImages([]));
        }
    }, [dispatch, workerId]);

    // After successful review / reply, show toast and re-fetch
    useEffect(() => {
        if (successMessage) {
            showToast(successMessage, 'success');
            dispatch(fetchReviews(workerId));
            setReviewComment('');
            setReviewRating(5);
            setShowReviewForm(false);
            setReplyingTo(null);
            setReplyText('');
            setTimeout(() => dispatch(clearReviewState()), 200);
        }
    }, [successMessage, dispatch, workerId]);

    useEffect(() => {
        if (reviewError) {
            showToast(typeof reviewError === 'string' ? reviewError : 'Something went wrong', 'error');
            setTimeout(() => dispatch(clearReviewState()), 200);
        }
    }, [reviewError, dispatch]);

    const handleSubmitReview = () => {
        if (!reviewComment.trim()) return;
        dispatch(postReview({
            workerId,
            rating: reviewRating,
            comment: reviewComment.trim(),
            userName: email?.split('@')[0] || 'User',
        }));
    };

    const handleSubmitReply = (reviewId) => {
        if (!replyText.trim()) return;
        dispatch(replyToReview({ reviewId, reply: replyText.trim() }));
    };

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : worker.rating || 4.5;

    const formatDate = (iso) => {
        try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return ''; }
    };

    // Is the current user the worker?
    const isWorker = role === 'WORKER';

    return (
        <div className="worker-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back to Results</button>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDone={() => setToast(null)}
                />
            )}

            {/* Header */}
            <header className="worker-header">
                <div className="worker-profile-info">
                    <div className="worker-avatar-placeholder">{worker.name.charAt(0)}</div>
                    <div className="worker-text">
                        <h1>{worker.name}</h1>
                        <p className="worker-skill">{worker.skill}</p>
                        <div className="worker-badges">
                            <span className={`status-badge ${worker.available ? 'available' : 'busy'}`}>
                                {worker.available ? 'Available Now' : 'Currently Busy'}
                            </span>
                            <span className="rating-badge">
                                ⭐ {avgRating} ({reviews.length || worker.reviews || 0} reviews)
                            </span>
                        </div>
                    </div>
                </div>
                <div className="worker-actions">
                    <button
                        className="book-btn"
                        onClick={() => setShowBookingModal(true)}
                        disabled={!worker.available}
                    >
                        📅 Book Service
                    </button>
                    <button
                        className="message-btn"
                        onClick={() => setShowMessageModal(true)}
                    >
                        💬 Message
                    </button>
                </div>
            </header>

            <div className="worker-content">
                {/* About */}
                <section className="worker-bio">
                    <h2>About</h2>
                    <p>{worker.bio || 'No bio available.'}</p>
                    <div className="worker-stats">
                        <div className="stat-item">
                            <span className="stat-label">Rate</span>
                            <span className="stat-value">{worker.hourlyRate || '₹500/hr'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Radius</span>
                            <span className="stat-value">{worker.serviceRadiusKm} km</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Experience</span>
                            <span className="stat-value">5+ Years</span>
                        </div>
                    </div>
                </section>

                {/* Portfolio */}
                <section className="worker-portfolio">
                    <h2>Recent Work</h2>
                    {portfolioImages.length === 0 ? (
                        <p className="dwp-empty">No work photos uploaded yet.</p>
                    ) : (
                        <div className="portfolio-grid">
                            {portfolioImages.map((img, i) => (
                                <div key={i} className="portfolio-item" onClick={() => setLightboxImg(img)}>
                                    <img src={img} alt={`Work ${i + 1}`} />
                                    <div className="portfolio-overlay">🔍 View</div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Reviews */}
                <section className="worker-reviews">
                    <div className="dwp-reviews-header">
                        <h2>Reviews &amp; Ratings</h2>
                        {isAuthenticated && workerId && !isWorker && (
                            <button
                                className="dwp-add-review-btn"
                                onClick={() => setShowReviewForm(v => !v)}
                            >
                                {showReviewForm ? 'Cancel' : '✏️ Write a Review'}
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="dwp-review-form">
                            <div className="dwp-stars">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <Star key={n} filled={n <= reviewRating} onClick={() => setReviewRating(n)} />
                                ))}
                                <span className="dwp-rating-label">{reviewRating}/5</span>
                            </div>
                            <textarea
                                className="dwp-review-textarea"
                                placeholder="Share your experience with this worker…"
                                value={reviewComment}
                                onChange={e => setReviewComment(e.target.value)}
                                rows={3}
                            />
                            <button
                                className="dwp-submit-review"
                                onClick={handleSubmitReview}
                                disabled={submitLoading || !reviewComment.trim()}
                            >
                                {submitLoading ? 'Submitting…' : 'Submit Review'}
                            </button>
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviewsLoading && <div className="dwp-loading">Loading reviews…</div>}
                    {!reviewsLoading && reviews.length === 0 && (
                        <p className="dwp-empty">No reviews yet. Be the first!</p>
                    )}
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="review-user-avatar">{(review.userName || 'U').charAt(0)}</div>
                                    <div>
                                        <span className="review-user">{review.userName || review.userEmail}</span>
                                        <span className="review-date">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {'⭐'.repeat(review.rating)}
                                    <span className="review-rating-num">{review.rating}.0</span>
                                </div>
                                <p className="review-comment">{review.comment}</p>

                                {/* Worker Reply Block */}
                                {review.workerReply && (
                                    <div className="review-reply">
                                        <div className="review-reply-header">
                                            <span className="review-reply-label">🔧 Worker replied</span>
                                            {review.repliedAt && (
                                                <span className="review-reply-date">{formatDate(review.repliedAt)}</span>
                                            )}
                                        </div>
                                        <p className="review-reply-text">{review.workerReply}</p>
                                    </div>
                                )}

                                {/* Reply Form — visible only to worker */}
                                {isWorker && !review.workerReply && (
                                    replyingTo === review.id ? (
                                        <div className="dwp-reply-form">
                                            <textarea
                                                className="dwp-review-textarea"
                                                placeholder="Write your reply…"
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                rows={2}
                                            />
                                            <div className="dwp-reply-actions">
                                                <button
                                                    className="dwp-submit-review"
                                                    onClick={() => handleSubmitReply(review.id)}
                                                    disabled={replyLoading || !replyText.trim()}
                                                >
                                                    {replyLoading ? 'Posting…' : 'Post Reply'}
                                                </button>
                                                <button
                                                    className="dwp-cancel-reply"
                                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="dwp-reply-btn"
                                            onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                                        >
                                            💬 Reply
                                        </button>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Lightbox */}
            {lightboxImg && (
                <div className="dwp-lightbox" onClick={() => setLightboxImg(null)}>
                    <img src={lightboxImg} alt="Work preview" />
                    <button className="dwp-lightbox-close">✕</button>
                </div>
            )}

            {showBookingModal && (
                <BookingModal
                    worker={worker}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={() => navigate('/userlayout/bookings')}
                />
            )}

            {showMessageModal && (
                <MessageModal
                    worker={worker}
                    onClose={() => setShowMessageModal(false)}
                />
            )}
        </div>
    );
};

export default DetailedWorkerPage;
