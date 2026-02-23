import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Worker fetches their incoming bookings (identified by JWT cookie)
export const fetchWorkerBookings = createAsyncThunk(
    "workerBooking/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(`/worker/bookings`, {
                withCredentials: true,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch jobs");
        }
    }
);

// Worker accepts a booking
export const acceptBooking = createAsyncThunk(
    "workerBooking/accept",
    async ({ bookingId }, { rejectWithValue }) => {
        try {
            await api.post(`/worker/bookings/${bookingId}/accept`, {}, { withCredentials: true });
            return bookingId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to accept");
        }
    }
);

// Worker rejects a booking
export const rejectBooking = createAsyncThunk(
    "workerBooking/reject",
    async ({ bookingId }, { rejectWithValue }) => {
        try {
            await api.post(`/worker/bookings/${bookingId}/reject`, {}, { withCredentials: true });
            return bookingId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to reject");
        }
    }
);

// Worker marks a booking complete
export const completeBooking = createAsyncThunk(
    "workerBooking/complete",
    async ({ bookingId }, { rejectWithValue }) => {
        try {
            await api.post(`/worker/bookings/${bookingId}/complete`, {}, { withCredentials: true });
            return bookingId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to complete");
        }
    }
);

const workerBookingSlice = createSlice({
    name: "workerBooking",
    initialState: {
        bookings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkerBookings.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchWorkerBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchWorkerBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Optimistically update status in Redux when accepted/rejected/completed
            .addCase(acceptBooking.fulfilled, (state, action) => {
                const b = state.bookings.find(b => b.id === action.payload);
                if (b) b.status = "ACCEPTED";
            })
            .addCase(rejectBooking.fulfilled, (state, action) => {
                const b = state.bookings.find(b => b.id === action.payload);
                if (b) b.status = "REJECTED";
            })
            .addCase(completeBooking.fulfilled, (state, action) => {
                const b = state.bookings.find(b => b.id === action.payload);
                if (b) b.status = "COMPLETED";
            });
    },
});

export default workerBookingSlice.reducer;
