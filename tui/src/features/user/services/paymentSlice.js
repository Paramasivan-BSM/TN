import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// Create a payment order
export const createOrder = createAsyncThunk(
    "payment/createOrder",
    async ({ bookingId }, { rejectWithValue }) => {
        try {
            const res = await api.post("/payments/create-order", { bookingId }, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create payment order");
        }
    }
);

// Confirm (simulate) the payment
export const confirmPayment = createAsyncThunk(
    "payment/confirm",
    async ({ orderId }, { rejectWithValue }) => {
        try {
            const res = await api.post("/payments/confirm", { orderId }, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Payment failed");
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        order: null,
        receipt: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearPaymentState: (state) => {
            state.order = null;
            state.receipt = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(confirmPayment.pending, (state) => { state.loading = true; })
            .addCase(confirmPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.receipt = action.payload;
                state.order = null;
            })
            .addCase(confirmPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
