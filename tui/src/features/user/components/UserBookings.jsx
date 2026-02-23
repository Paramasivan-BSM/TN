import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings } from '../services/bookingSlice';
import './UserBookings.css';

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    ACCEPTED: { label: 'Accepted', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    REJECTED: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    PAID: { label: 'Paid', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    IN_PROGRESS: { label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    COMPLETED: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    CANCELLED: { label: 'Cancelled', color: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
};

const StatusChip = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    return (
        <span className="ub-chip" style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.label}
        </span>
    );
};

const UserBookings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bookings, loading, error } = useSelector(state => state.booking);

    useEffect(() => { dispatch(fetchMyBookings()); }, [dispatch]);

    if (loading) return (
        <div className="ub-page">
            <div className="ub-loading"><div className="ub-spinner" /><p>Loading bookings...</p></div>
        </div>
    );

    if (error) return (
        <div className="ub-page"><div className="ub-empty"><p style={{ color: '#ef4444' }}>Error: {error}</p></div></div>
    );

    return (
        <div className="ub-page">
            <div className="ub-header">
                <button className="ub-back" onClick={() => navigate(-1)}>← Back</button>
                <div>
                    <h1 className="ub-title">My Bookings</h1>
                    <p className="ub-sub">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="ub-empty">
                    <div className="ub-empty-icon">📋</div>
                    <h3>No bookings yet</h3>
                    <p>Search for a worker and book a service to get started.</p>
                    <button className="ub-cta" onClick={() => navigate('/userlayout')}>Find Workers</button>
                </div>
            ) : (
                <div className="ub-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="ub-card">
                            <div className="ub-card-top">
                                <div className="ub-card-avatar">
                                    {booking.workerName?.charAt(0)}
                                </div>
                                <div className="ub-card-info">
                                    <h3 className="ub-worker-name">{booking.workerName}</h3>
                                    <p className="ub-card-date">
                                        📅 {booking.scheduledDate
                                            ? new Date(booking.scheduledDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                                            : 'Date not set'}
                                    </p>
                                </div>
                                <StatusChip status={booking.status} />
                            </div>

                            <p className="ub-description">"{booking.description}"</p>

                            <div className="ub-card-footer">
                                <div className="ub-amount">
                                    <span className="ub-amount-label">Amount</span>
                                    <span className="ub-amount-val">₹{booking.amount?.toFixed(2)}</span>
                                </div>

                                {booking.status === 'ACCEPTED' && (
                                    <button
                                        className="ub-pay-btn"
                                        onClick={() => navigate(`/userlayout/pay/${booking.id}`)}
                                    >
                                        💳 Pay Now
                                    </button>
                                )}

                                {booking.status === 'PENDING' && (
                                    <span className="ub-pending-note">⏳ Waiting for worker to accept</span>
                                )}

                                {booking.status === 'COMPLETED' && (
                                    <span className="ub-done-note">✅ Service completed</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings;
