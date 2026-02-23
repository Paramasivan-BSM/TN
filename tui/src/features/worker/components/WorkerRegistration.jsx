import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    registerWorker,
    fetchWorkerProfile,
    updateWorkerProfile,
    resetWorkerState
} from "../services/WorkerSlice";
import { fetchLocation } from "../../user/services/locationSlice";
import "./WorkerRegistration.css";

const AVAILABILITY_OPTIONS = [
    { value: true, label: "✅ Available", desc: "Visible to users & accepting jobs" },
    { value: false, label: "🔴 Unavailable", desc: "Hidden from search results" },
];

const WorkerRegistration = () => {
    const dispatch = useDispatch();
    const { latitude, longitude, status: locationStatus } = useSelector(s => s.location);
    const { loading, error, success, updateSuccess, workerData } = useSelector(s => s.worker);

    const [isEditMode, setIsEditMode] = useState(false);
    const [form, setForm] = useState({
        name: "",
        skill: "",
        bio: "",
        radiusKm: 10,
        ratePerHour: 0,
        experienceYears: 0,
        available: true,
        lat: "",
        lng: ""
    });

    // Fetch location and existing profile on mount
    useEffect(() => {
        if (!latitude || !longitude) dispatch(fetchLocation());
        dispatch(fetchWorkerProfile());
    }, [dispatch]);

    // When profile loads, switch to edit mode and pre-fill form
    useEffect(() => {
        if (workerData) {
            setIsEditMode(true);
            setForm({
                name: workerData.name || "",
                skill: workerData.skill || "",
                bio: workerData.bio || "",
                radiusKm: workerData.serviceRadiusKm || 10,
                ratePerHour: workerData.ratePerHour || 0,
                experienceYears: workerData.experienceYears || 0,
                available: workerData.available ?? true,
                lat: workerData.lat || latitude || "",
                lng: workerData.lng || longitude || ""
            });
        }
    }, [workerData]);

    // Auto-fill coordinates if not already set
    useEffect(() => {
        if (latitude && longitude && !form.lat) {
            setForm(p => ({ ...p, lat: latitude, lng: longitude }));
        }
    }, [latitude, longitude]);

    // Redirect to dashboard after successful registration
    useEffect(() => {
        if (success) {
            const t = setTimeout(() => dispatch(resetWorkerState()), 3000);
            return () => clearTimeout(t);
        }
        if (updateSuccess) {
            const t = setTimeout(() => dispatch(resetWorkerState()), 3000);
            return () => clearTimeout(t);
        }
    }, [success, updateSuccess, dispatch]);

    const handleChange = e => {
        const { name, value, type } = e.target;
        setForm(p => ({ ...p, [name]: type === "number" ? parseFloat(value) || 0 : value }));
    };

    const setAvailable = val => setForm(p => ({ ...p, available: val }));

    const handleSubmit = e => {
        e.preventDefault();
        const payload = {
            ...form,
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng),
        };
        if (isEditMode) {
            dispatch(updateWorkerProfile(payload));
        } else {
            dispatch(registerWorker(payload));
        }
    };

    return (
        <div className="wr-page">
            <div className="wr-card">
                <div className="wr-header">
                    <h1 className="wr-title">
                        {isEditMode ? "✏️ Edit Profile" : "🛠️ Worker Registration"}
                    </h1>
                    <p className="wr-subtitle">
                        {isEditMode
                            ? "Update your details — changes are saved instantly"
                            : "Set up your professional profile to start receiving job requests"}
                    </p>
                </div>

                {error && (
                    <div className="wr-alert wr-alert-error">
                        ⚠️ {typeof error === "object" ? JSON.stringify(error) : error}
                    </div>
                )}
                {(success || updateSuccess) && (
                    <div className="wr-alert wr-alert-success">
                        ✅ {isEditMode ? "Profile updated successfully!" : "Registration successful!"}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="wr-form">

                    {/* ── Availability Toggle ── */}
                    <div className="wr-field">
                        <label className="wr-label">Availability</label>
                        <div className="wr-toggle-row">
                            {AVAILABILITY_OPTIONS.map(opt => (
                                <button
                                    key={String(opt.value)}
                                    type="button"
                                    className={`wr-toggle-btn ${form.available === opt.value ? "wr-toggle-active" : ""}`}
                                    onClick={() => setAvailable(opt.value)}
                                >
                                    <span className="wr-toggle-label">{opt.label}</span>
                                    <span className="wr-toggle-desc">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Basic Info ── */}
                    <div className="wr-row">
                        <div className="wr-field">
                            <label className="wr-label">Full Name *</label>
                            <input
                                className="wr-input"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Ravi Kumar"
                            />
                        </div>
                        <div className="wr-field">
                            <label className="wr-label">Skill / Trade *</label>
                            <input
                                className="wr-input"
                                type="text"
                                name="skill"
                                value={form.skill}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Electrician, Plumber"
                            />
                        </div>
                    </div>

                    {/* ── Bio ── */}
                    <div className="wr-field">
                        <label className="wr-label">Bio / About you</label>
                        <textarea
                            className="wr-input wr-textarea"
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Briefly describe your expertise, specialties, and working style…"
                        />
                    </div>

                    {/* ── Rate & Experience ── */}
                    <div className="wr-row">
                        <div className="wr-field">
                            <label className="wr-label">Rate (₹/hr) *</label>
                            <div className="wr-input-prefix-wrap">
                                <span className="wr-prefix">₹</span>
                                <input
                                    className="wr-input wr-input-prefix"
                                    type="number"
                                    name="ratePerHour"
                                    value={form.ratePerHour}
                                    onChange={handleChange}
                                    min={0}
                                    required
                                    placeholder="500"
                                />
                            </div>
                        </div>
                        <div className="wr-field">
                            <label className="wr-label">Experience (years)</label>
                            <input
                                className="wr-input"
                                type="number"
                                name="experienceYears"
                                value={form.experienceYears}
                                onChange={handleChange}
                                min={0}
                                placeholder="3"
                            />
                        </div>
                        <div className="wr-field">
                            <label className="wr-label">Service Radius (km)</label>
                            <input
                                className="wr-input"
                                type="number"
                                name="radiusKm"
                                value={form.radiusKm}
                                onChange={handleChange}
                                min={1}
                                required
                                placeholder="10"
                            />
                        </div>
                    </div>

                    {/* ── Location (auto) ── */}
                    <div className="wr-row">
                        <div className="wr-field">
                            <label className="wr-label">Latitude</label>
                            <input
                                className="wr-input wr-readonly"
                                type="text"
                                value={form.lat}
                                readOnly
                                placeholder={locationStatus === "loading" ? "Detecting…" : "Auto-detected"}
                            />
                        </div>
                        <div className="wr-field">
                            <label className="wr-label">Longitude</label>
                            <input
                                className="wr-input wr-readonly"
                                type="text"
                                value={form.lng}
                                readOnly
                                placeholder="Auto-detected"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="wr-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving…"
                            : isEditMode ? "💾 Save Changes" : "🚀 Create Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WorkerRegistration;
