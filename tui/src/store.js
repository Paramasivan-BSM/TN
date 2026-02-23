
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/services/authSlice';
import userReducer from './features/user/services/UserSlice';
import locationReducer from './features/user/services/locationSlice';
import workerReducer from './features/worker/services/WorkerSlice';
import bookingReducer from './features/user/services/bookingSlice';
import paymentReducer from './features/user/services/paymentSlice';
import workerBookingReducer from './features/worker/services/workerBookingSlice';
import reviewReducer from './features/user/services/reviewSlice';
import messageReducer from './features/user/services/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userscreen: userReducer,
    location: locationReducer,
    worker: workerReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    workerBooking: workerBookingReducer,
    reviews: reviewReducer,
    messages: messageReducer,
  },
});
