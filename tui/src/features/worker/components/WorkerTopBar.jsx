import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logout } from "../../auth/services/authSlice";
import "./WorkerTopBar.css";

export const WorkerTopBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const links = [
        { to: "/worker", label: "🏠 Home", exact: true },
        { to: "/worker/dashboard", label: "📊 Dashboard" },
        { to: "/worker/inbox", label: "💬 Messages" },
        { to: "/worker/register", label: "🪪 Profile" },
    ];

    const isActive = (to, exact) =>
        exact ? location.pathname === to : location.pathname.startsWith(to) && to !== "/worker";

    return (
        <nav className="wtb-nav">
            <div className="wtb-inner">
                {/* Logo */}
                <Link to="/worker" className="wtb-logo">
                    <span className="wtb-logo-icon">⚡</span>
                    <span className="wtb-logo-text">TradeNest<span className="wtb-logo-pro"> Pro</span></span>
                </Link>

                {/* Desktop links */}
                <div className="wtb-links">
                    {links.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`wtb-link ${isActive(l.to, l.exact) ? 'wtb-link-active' : ''}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* Right */}
                <div className="wtb-right">
                    <button className="wtb-logout" onClick={handleLogout}>Logout</button>

                    {/* Mobile burger */}
                    <button className="wtb-burger" onClick={() => setMenuOpen(o => !o)}>
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="wtb-mobile-menu">
                    {links.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`wtb-mobile-link ${isActive(l.to, l.exact) ? 'wtb-link-active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <button className="wtb-mobile-logout" onClick={handleLogout}>🚪 Logout</button>
                </div>
            )}
        </nav>
    );
};
