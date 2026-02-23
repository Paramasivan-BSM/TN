import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Create a new booking (USER role)
export const createBooking = createAsyncThunk(
    "booking/create",
    async ({ workerName, workerId, description, amount, scheduledDate }, { rejectWithValue }) => {
        try {
            const res = await api.post("/bookings/create", {
                workerName, workerId, description, amount, scheduledDate
            }, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create booking");
        }
    }
);

// Fetch all bookings for the logged-in user
export const fetchMyBookings = createAsyncThunk(
    "booking/fetchMy",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/bookings/my", { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch bookings");
        }
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        bookings: [],
        currentBooking: null,
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearBookingState: (state) => {
            state.error = null;
            state.successMessage = null;
            state.currentBooking = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBooking = action.payload;
                state.successMessage = "Booking created! Waiting for worker to accept.";
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
