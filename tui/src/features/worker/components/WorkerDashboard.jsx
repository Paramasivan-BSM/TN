import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkerBookings, acceptBooking, rejectBooking, completeBooking } from '../services/workerBookingSlice';
import './WorkerDashboard.css';

const STATUS_COLOR = {
    PENDING: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    ACCEPTED: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    REJECTED: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    PAID: { color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    IN_PROGRESS: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    COMPLETED: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};

const Chip = ({ status }) => {
    const c = STATUS_COLOR[status] || STATUS_COLOR.PENDING;
    return <span className="wd-chip" style={{ color: c.color, background: c.bg }}>{status}</span>;
};

const WorkerDashboard = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector(state => state.workerBooking);
    const { workerData } = useSelector(state => state.worker);
    const [activeTab, setActiveTab] = useState('pending');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        dispatch(fetchWorkerBookings());
    }, [dispatch]);

    const pending = bookings.filter(b => b.status === 'PENDING');
    const active = bookings.filter(b => ['ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status));
    const history = bookings.filter(b => ['COMPLETED', 'REJECTED', 'CANCELLED'].includes(b.status));
    const totalEarnings = history
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + (b.amount * 0.98), 0);

    const handle = async (action, bookingId) => {
        setActionLoading(bookingId + action);
        await dispatch(action({ bookingId }));
        setActionLoading(null);
    };

    const tabs = [
        { key: 'pending', label: `Requests (${pending.length})` },
        { key: 'active', label: `Active (${active.length})` },
        { key: 'history', label: `History (${history.length})` },
    ];

    const tabData = { pending, active, history };
    const currentList = tabData[activeTab];

    return (
        <div className="wd-page">
            {/* Stats Row */}
            <div className="wd-stats">
                <div className="wd-stat">
                    <span className="wd-stat-val">{bookings.length}</span>
                    <span className="wd-stat-label">Total Jobs</span>
                </div>
                <div className="wd-stat">
                    <span className="wd-stat-val">{pending.length}</span>
                    <span className="wd-stat-label">Pending</span>
                </div>
                <div className="wd-stat">
                    <span className="wd-stat-val">{history.filter(b => b.status === 'COMPLETED').length}</span>
                    <span className="wd-stat-label">Completed</span>
                </div>
                <div className="wd-stat wd-stat-green">
                    <span className="wd-stat-val">₹{totalEarnings.toFixed(0)}</span>
                    <span className="wd-stat-label">Earnings (98%)</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="wd-tabs">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        className={`wd-tab ${activeTab === t.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="wd-loading"><div className="wd-spinner" /><p>Loading jobs...</p></div>
            ) : currentList.length === 0 ? (
                <div className="wd-empty">
                    <span className="wd-empty-icon">
                        {activeTab === 'pending' ? '📬' : activeTab === 'active' ? '🔧' : '📂'}
                    </span>
                    <p>No {activeTab} jobs</p>
                </div>
            ) : (
                <div className="wd-list">
                    {currentList.map(booking => (
                        <div key={booking.id} className="wd-card">
                            <div className="wd-card-header">
                                <div className="wd-user-avatar">
                                    {booking.userEmail?.charAt(0).toUpperCase()}
                                </div>
                                <div className="wd-card-meta">
                                    <h3 className="wd-user-email">{booking.userEmail}</h3>
                                    <p className="wd-scheduled">
                                        📅 {booking.scheduledDate
                                            ? new Date(booking.scheduledDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                                            : 'Not scheduled'}
                                    </p>
                                </div>
                                <Chip status={booking.status} />
                            </div>

                            <div className="wd-description">
                                "{booking.description}"
                            </div>

                            <div className="wd-card-footer">
                                <div className="wd-amount-info">
                                    <span className="wd-amount-total">₹{booking.amount?.toFixed(2)}</span>
                                    <span className="wd-amount-worker">
                                        You receive: ₹{(booking.amount * 0.98).toFixed(2)}
                                    </span>
                                </div>

                                <div className="wd-actions">
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <button
                                                className="wd-btn wd-btn-accept"
                                                disabled={actionLoading === booking.id + acceptBooking}
                                                onClick={() => handle(acceptBooking, booking.id)}
                                            >
                                                {actionLoading === booking.id + acceptBooking ? '...' : '✓ Accept'}
                                            </button>
                                            <button
                                                className="wd-btn wd-btn-reject"
                                                disabled={actionLoading === booking.id + rejectBooking}
                                                onClick={() => handle(rejectBooking, booking.id)}
                                            >
                                                ✕ Reject
                                            </button>
                                        </>
                                    )}
                                    {(booking.status === 'PAID' || booking.status === 'IN_PROGRESS') && (
                                        <button
                                            className="wd-btn wd-btn-complete"
                                            onClick={() => handle(completeBooking, booking.id)}
                                        >
                                            🏁 Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkerDashboard;
