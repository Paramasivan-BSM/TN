import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills, selectService } from "../services/UserSlice";
import { fetchLocation } from "../services/locationSlice";
import "./UserStyleContent.css";

const CATEGORIES = [
  { icon: "⚡", label: "Electrician", color: "#f59e0b", desc: "Wiring, repairs & installations" },
  { icon: "🔧", label: "Plumber", color: "#3b82f6", desc: "Pipes, leaks & fittings" },
  { icon: "🪟", label: "Carpenter", color: "#a855f7", desc: "Furniture, doors & woodwork" },
  { icon: "🎨", label: "Painter", color: "#ec4899", desc: "Interior & exterior painting" },
  { icon: "❄️", label: "AC Repair", color: "#06b6d4", desc: "Service, repair & installation" },
  { icon: "🧹", label: "Cleaner", color: "#10b981", desc: "Home & office deep cleaning" },
  { icon: "🔒", label: "Locksmith", color: "#ef4444", desc: "Locks, keys & security" },
  { icon: "🌿", label: "Gardener", color: "#84cc16", desc: "Lawn care & landscaping" },
];

const WHY = [
  { icon: "🛡️", title: "Verified Workers", desc: "Every professional is background-checked and skill-verified." },
  { icon: "⚡", title: "Instant Booking", desc: "Book a worker in under 60 seconds, any time of day." },
  { icon: "💳", title: "Secure Payments", desc: "Your money is held safely until the job is complete." },
  { icon: "⭐", title: "Rated & Reviewed", desc: "Real ratings from real users — no fake reviews." },
];

const UserStyleContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { latitude, longitude } = useSelector(s => s.location);
  const { skills } = useSelector(s => s.userscreen);
  const { user } = useSelector(s => s.auth);

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const inputRef = useRef();

  const userName = user?.name || user?.email?.split("@")[0] || "there";
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => { dispatch(fetchSkills()); }, [dispatch]);

  useEffect(() => {
    if (!query.trim()) { setFiltered(skills || []); return; }
    setFiltered((skills || []).filter(s =>
      s.toLowerCase().includes(query.toLowerCase())
    ));
  }, [query, skills]);

  const go = (value) => {
    if (!value?.trim()) return;
    dispatch(fetchLocation());
    dispatch(selectService(value));
    navigate(`/userlayout/search/${value}`);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") { setShowDrop(false); go(query); }
  };

  return (
    <div className="usc-page">

      {/* ===== HERO ===== */}
      <section className="usc-hero">
        <div className="usc-blob b1" /><div className="usc-blob b2" /><div className="usc-blob b3" />

        <div className="usc-hero-content">
          <p className="usc-greet">{timeGreet}, {userName} 👋</p>
          <h1 className="usc-headline">
            Find Trusted <span className="usc-hl">Professionals</span><br />
            Right at Your Door
          </h1>
          <p className="usc-sub">Electricians, plumbers, painters &amp; more — book in 60 seconds</p>

          {/* ---- Search box ---- */}
          <div className="usc-search-wrap" ref={inputRef}>
            <div className="usc-search-box">
              <span className="usc-search-icon">🔍</span>
              <input
                className="usc-search-input"
                placeholder="Search electrician, plumber…"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                onBlur={() => setTimeout(() => setShowDrop(false), 150)}
                onKeyDown={handleKey}
              />
              <button className="usc-search-btn" onClick={() => go(query)}>Search</button>
            </div>

            {showDrop && filtered.length > 0 && (
              <ul className="usc-dropdown">
                {filtered.slice(0, 8).map(s => (
                  <li key={s} className="usc-drop-item" onMouseDown={() => { setQuery(s); go(s); }}>
                    <span className="usc-drop-icon">🔎</span> {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Location pill */}
          {latitude && longitude && (
            <p className="usc-loc">📍 Location detected — showing workers near you</p>
          )}
        </div>
      </section>

      {/* ===== QUICK STATS ===== */}
      <section className="usc-stats">
        {[
          { val: "128+", label: "Verified Workers", color: "#38ef7d" },
          { val: "3.2k+", label: "Jobs Completed", color: "#60a5fa" },
          { val: "4.9★", label: "Average Rating", color: "#f59e0b" },
          { val: "< 1hr", label: "Avg. Response Time", color: "#a78bfa" },
        ].map(s => (
          <div key={s.label} className="usc-stat-pill">
            <span className="usc-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="usc-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="usc-section">
        <h2 className="usc-section-title">Popular Services</h2>
        <div className="usc-categories">
          {CATEGORIES.map(c => (
            <button
              key={c.label}
              className="usc-cat-card"
              style={{ "--accent": c.color }}
              onClick={() => go(c.label)}
            >
              <span className="usc-cat-icon">{c.icon}</span>
              <span className="usc-cat-name">{c.label}</span>
              <span className="usc-cat-desc">{c.desc}</span>
              <span className="usc-cat-shine" />
            </button>
          ))}
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="usc-section usc-why-section">
        <h2 className="usc-section-title">Why TradeNest?</h2>
        <div className="usc-why-grid">
          {WHY.map(w => (
            <div key={w.title} className="usc-why-card">
              <span className="usc-why-icon">{w.icon}</span>
              <h3 className="usc-why-title">{w.title}</h3>
              <p className="usc-why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="usc-cta">
        <div className="usc-cta-inner">
          <h2 className="usc-cta-title">Ready to get started?</h2>
          <p className="usc-cta-sub">Search for a service above or explore all categories</p>
          <button className="usc-cta-btn" onClick={() => go(query || (skills?.[0] ?? ""))}>
            Book a Worker Now →
          </button>
        </div>
      </section>

    </div>
  );
};

export { UserStyleContent };
