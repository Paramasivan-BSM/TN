import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../auth/services/authSlice";
import { closeMenu, switchUserType } from "../services/UserSlice";
import { fetchLocation } from "../services/locationSlice";
import "./UserTopBar.css";

export const UserTopBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            dispatch(closeMenu());
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleBecomeWorker = () => {
        if (window.confirm("Switching to worker mode is permanent for this session. Continue?")) {
            dispatch(switchUserType()).then(() => window.location.reload());
        }
    };

    const links = [
        { to: "/userlayout", label: "🏠 Home", exact: true },
        { to: "/userlayout/bookings", label: "📋 My Bookings" },
    ];

    const isActive = (to, exact) =>
        exact ? location.pathname === to
            : location.pathname.startsWith(to) && to !== "/userlayout";

    return (
        <nav className="utb-nav">
            <div className="utb-inner">
                {/* Logo */}
                <Link to="/userlayout" className="utb-logo">
                    <span className="utb-logo-icon">🏡</span>
                    <span className="utb-logo-text">TradeNest</span>
                </Link>

                {/* Desktop links */}
                <div className="utb-links">
                    {links.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`utb-link ${isActive(l.to, l.exact) ? "utb-link-active" : ""}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* Right group */}
                <div className="utb-right">
                    <button className="utb-loc-btn" onClick={() => dispatch(fetchLocation())} title="Update location">
                        📍
                    </button>
                    <button className="utb-worker-btn" onClick={handleBecomeWorker}>
                        Become a Worker
                    </button>
                    <button className="utb-logout" onClick={handleLogout}>Logout</button>

                    {/* Mobile burger */}
                    <button className="utb-burger" onClick={() => setMobileOpen(o => !o)}>
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="utb-mobile-menu">
                    {links.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`utb-mobile-link ${isActive(l.to, l.exact) ? "utb-link-active" : ""}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <button className="utb-mobile-item" onClick={() => { setMobileOpen(false); dispatch(fetchLocation()); }}>📍 Update Location</button>
                    <button className="utb-mobile-item" onClick={() => { setMobileOpen(false); handleBecomeWorker(); }}>⚡ Become a Worker</button>
                    <button className="utb-mobile-logout" onClick={() => { setMobileOpen(false); handleLogout(); }}>🚪 Logout</button>
                </div>
            )}
        </nav>
    );
};

export default UserTopBar;
