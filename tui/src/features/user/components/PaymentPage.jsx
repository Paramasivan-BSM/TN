import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createOrder, confirmPayment, clearPaymentState } from '../services/paymentSlice';
import './PaymentPage.css';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, receipt, loading, error } = useSelector(state => state.payment);

    const [step, setStep] = useState('summary'); // summary | checkout | success
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        dispatch(createOrder({ bookingId }));
        return () => dispatch(clearPaymentState());
    }, [bookingId, dispatch]);

    const handleCardChange = (e) => setCard(p => ({ ...p, [e.target.name]: e.target.value }));

    const handlePayNow = async (e) => {
        e.preventDefault();
        if (!order?.orderId) return;
        setProcessing(true);
        // Simulate a brief payment processing delay (like a real gateway)
        await new Promise(r => setTimeout(r, 2000));
        const result = await dispatch(confirmPayment({ orderId: order.orderId }));
        setProcessing(false);
        if (confirmPayment.fulfilled.match(result)) {
            setStep('success');
        }
    };

    const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    const formatExpiry = (val) => val.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').slice(0, 5);

    if (loading && !order) {
        return (
            <div className="pp-page">
                <div className="pp-loading"><div className="pp-spinner" /><p>Preparing payment...</p></div>
            </div>
        );
    }

    if (step === 'success' && receipt) {
        return (
            <div className="pp-page">
                <div className="pp-success-card">
                    <div className="pp-success-icon">🎉</div>
                    <h2>Payment Successful!</h2>
                    <p className="pp-success-sub">Your booking has been confirmed</p>

                    <div className="pp-receipt">
                        <div className="pp-receipt-row">
                            <span>Payment ID</span>
                            <span className="pp-receipt-val mono">{receipt.paymentId}</span>
                        </div>
                        <div className="pp-receipt-row">
                            <span>Total Paid</span>
                            <span className="pp-receipt-val">₹{receipt.amount?.toFixed(2)}</span>
                        </div>
                        <div className="pp-receipt-row">
                            <span>Worker Receives</span>
                            <span className="pp-receipt-val green">₹{receipt.workerAmount?.toFixed(2)}</span>
                        </div>
                        <div className="pp-receipt-row">
                            <span>Platform Fee (2%)</span>
                            <span className="pp-receipt-val muted">₹{receipt.adminCommission?.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className="pp-btn" onClick={() => navigate('/userlayout/bookings')}>
                        View My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pp-page">
            <div className="pp-container">
                {/* Left Panel — Summary */}
                <div className="pp-summary">
                    <div className="pp-logo">🔒 TradeNest Pay</div>
                    <h3>Payment Summary</h3>

                    <div className="pp-summary-detail">
                        <span>Service Booking</span>
                        <span>₹{order?.amount?.toFixed(2) ?? '—'}</span>
                    </div>
                    <div className="pp-summary-detail">
                        <span>Platform Fee (2%)</span>
                        <span>₹{order ? (order.amount * 0.02).toFixed(2) : '—'}</span>
                    </div>
                    <div className="pp-divider" />
                    <div className="pp-summary-detail total">
                        <span>Total</span>
                        <span>₹{order?.amount?.toFixed(2) ?? '—'}</span>
                    </div>

                    <div className="pp-secure-badge">
                        <span>🔐 256-bit SSL Encrypted</span>
                        <span>Your payment is secure</span>
                    </div>

                    <div className="pp-test-note">
                        ⚠️ Demo Mode — No real money charged
                    </div>
                </div>

                {/* Right Panel — Card Form */}
                <div className="pp-checkout">
                    <h3>Card Details</h3>
                    <p className="pp-checkout-sub">Use any details — this is a simulation</p>

                    <form className="pp-form" onSubmit={handlePayNow}>
                        <div className="pp-field">
                            <label>Cardholder Name</label>
                            <input name="name" placeholder="John Doe" value={card.name} onChange={handleCardChange} required />
                        </div>

                        <div className="pp-field">
                            <label>Card Number</label>
                            <input
                                name="number"
                                placeholder="4111 1111 1111 1111"
                                value={card.number}
                                onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
                                maxLength={19}
                                required
                            />
                        </div>

                        <div className="pp-row">
                            <div className="pp-field">
                                <label>Expiry</label>
                                <input
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={card.expiry}
                                    onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                                    maxLength={5}
                                    required
                                />
                            </div>
                            <div className="pp-field">
                                <label>CVV</label>
                                <input name="cvv" placeholder="•••" maxLength={3} type="password"
                                    value={card.cvv} onChange={handleCardChange} required />
                            </div>
                        </div>

                        {error && <p className="pp-error">{typeof error === 'string' ? error : 'Payment error. Try again.'}</p>}

                        <button className="pp-pay-btn" type="submit" disabled={processing || loading || !order}>
                            {processing ? (
                                <><div className="pp-btn-spinner" /> Processing...</>
                            ) : (
                                `Pay ₹${order?.amount?.toFixed(2) ?? '...'}`
                            )}
                        </button>
                    </form>

                    <div className="pp-cards-row">
                        <span>💳</span><span>Visa</span><span>MasterCard</span><span>RuPay</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
