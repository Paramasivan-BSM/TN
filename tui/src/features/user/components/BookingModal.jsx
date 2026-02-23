import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, clearBookingState } from '../services/bookingSlice';
import './BookingModal.css';

const BookingModal = ({ worker, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const { loading, error, successMessage } = useSelector(state => state.booking);

    const [form, setForm] = useState({
        description: '',
        scheduledDate: '',
        amount: '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createBooking({
            workerName: worker.name,
            workerId: worker.id || '',   // worker.id = hex ObjectId string from backend
            description: form.description,
            amount: parseFloat(form.amount),
            scheduledDate: form.scheduledDate,
        }));
        if (createBooking.fulfilled.match(result)) {
            setTimeout(() => {
                dispatch(clearBookingState());
                onSuccess && onSuccess(result.payload);
                onClose();
            }, 2000);
        }
    };

    return (
        <div className="bm-overlay" onClick={onClose}>
            <div className="bm-modal" onClick={e => e.stopPropagation()}>
                <button className="bm-close" onClick={onClose}>✕</button>

                <div className="bm-header">
                    <div className="bm-avatar">{worker.name?.charAt(0)}</div>
                    <div>
                        <h2 className="bm-title">Book {worker.name}</h2>
                        <p className="bm-subtitle">{worker.skill}</p>
                    </div>
                </div>

                {successMessage ? (
                    <div className="bm-success">
                        <div className="bm-success-icon">✅</div>
                        <h3>Booking Sent!</h3>
                        <p>{successMessage}</p>
                    </div>
                ) : (
                    <form className="bm-form" onSubmit={handleSubmit}>
                        <div className="bm-field">
                            <label>Describe your problem</label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="e.g. My kitchen tap is leaking..."
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="bm-row">
                            <div className="bm-field">
                                <label>Preferred Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="scheduledDate"
                                    value={form.scheduledDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="bm-field">
                                <label>Amount (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="e.g. 500"
                                    min="1"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="bm-error">{typeof error === 'string' ? error : 'Something went wrong'}</p>}

                        <button className="bm-submit" type="submit" disabled={loading}>
                            {loading ? <span className="bm-spinner" /> : '🗓 Send Booking Request'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
