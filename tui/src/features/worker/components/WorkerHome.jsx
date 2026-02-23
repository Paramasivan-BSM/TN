import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWorkerBookings } from '../services/workerBookingSlice';
import CloudinaryUpload from './CloudinaryUpload';
import './WorkerHome.css';

const TIPS = [
    "Respond quickly to new requests — workers who accept within 1 hour get 3× more jobs.",
    "Keep your profile location updated for better match visibility.",
    "Completing jobs on time improves your ranking in search results.",
    "Mark jobs as complete promptly so you get paid faster.",
];

const WorkerHome = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bookings, loading } = useSelector(state => state.workerBooking);
    const { email } = useSelector(state => state.auth);
    const workerName = email?.split('@')[0] || 'Worker';
    const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
        dispatch(fetchWorkerBookings());
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    }, [dispatch]);

    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const active = bookings.filter(b => ['ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status)).length;
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;
    const earnings = bookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((s, b) => s + (b.amount || 0) * 0.98, 0);


    const stats = [
        { icon: '📬', label: 'New Requests', value: pending, color: '#f59e0b', glow: '#f59e0b30', route: '/worker/dashboard' },
        { icon: '🔧', label: 'Active Jobs', value: active, color: '#3b82f6', glow: '#3b82f620', route: '/worker/dashboard' },
        { icon: '✅', label: 'Completed', value: completed, color: '#10b981', glow: '#10b98120', route: '/worker/dashboard' },
        { icon: '💰', label: 'Earnings', value: `₹${earnings.toFixed(0)}`, color: '#a78bfa', glow: '#a78bfa25', route: '/worker/dashboard' },
    ];

    const quickActions = [
        {
            icon: '📊',
            title: 'My Dashboard',
            desc: 'View and manage all your job requests',
            gradient: 'linear-gradient(135deg,#11998e,#38ef7d)',
            route: '/worker/dashboard',
        },
        {
            icon: '🪪',
            title: 'My Profile',
            desc: 'Update your skills, location & service radius',
            gradient: 'linear-gradient(135deg,#6366f1,#a78bfa)',
            route: '/worker/register',
        },
    ];

    return (
        <div className="wh-page">
            {/* Animated hero */}
            <div className="wh-hero">
                <div className="wh-hero-blob wh-blob1" />
                <div className="wh-hero-blob wh-blob2" />
                <div className="wh-hero-blob wh-blob3" />

                <div className="wh-hero-content">
                    <div className="wh-avatar">
                        {workerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="wh-hero-text">
                        <p className="wh-greeting">{greeting} 👋</p>
                        <h1 className="wh-name">{workerName}</h1>
                        <p className="wh-role">TradeNest Professional Worker</p>
                    </div>
                </div>

                {pending > 0 && (
                    <button className="wh-alert-pill" onClick={() => navigate('/worker/dashboard')}>
                        🔔 {pending} new request{pending > 1 ? 's' : ''} waiting
                    </button>
                )}
            </div>

            <div className="wh-body">
                {/* Stats grid */}
                <h2 className="wh-section-title">Your Overview</h2>
                <div className="wh-stats">
                    {loading ? (
                        <div className="wh-loading"><div className="wh-spinner" /></div>
                    ) : stats.map(s => (
                        <div
                            key={s.label}
                            className="wh-stat-card"
                            style={{ '--glow': s.glow, '--accent': s.color }}
                            onClick={() => navigate(s.route)}
                        >
                            <div className="wh-stat-icon">{s.icon}</div>
                            <div className="wh-stat-val" style={{ color: s.color }}>{s.value}</div>
                            <div className="wh-stat-label">{s.label}</div>
                            <div className="wh-stat-shine" />
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <h2 className="wh-section-title">Quick Actions</h2>
                <div className="wh-actions">
                    {quickActions.map(a => (
                        <div
                            key={a.title}
                            className="wh-action-card"
                            style={{ '--grad': a.gradient }}
                            onClick={() => navigate(a.route)}
                        >
                            <div className="wh-action-icon">{a.icon}</div>
                            <div>
                                <div className="wh-action-title">{a.title}</div>
                                <div className="wh-action-desc">{a.desc}</div>
                            </div>
                            <span className="wh-action-arrow">→</span>
                        </div>
                    ))}
                </div>

                {/* Pro tip */}
                <div className="wh-tip">
                    <span className="wh-tip-icon">💡</span>
                    <p className="wh-tip-text"><strong>Pro tip:</strong> {TIPS[tipIdx]}</p>
                </div>

                {/* Portfolio Upload */}
                <h2 className="wh-section-title">Portfolio</h2>
                <div className="wh-upload-card">
                    <div className="wh-upload-info">
                        <span className="wh-upload-emoji">📸</span>
                        <div>
                            <div className="wh-upload-title">Showcase Your Work</div>
                            <div className="wh-upload-desc">Upload photos of completed jobs to attract more clients</div>
                        </div>
                    </div>
                    <CloudinaryUpload
                        onUploadSuccess={(url) => {
                            // Optionally show a toast / success pill
                            console.log('Uploaded:', url);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkerHome;
