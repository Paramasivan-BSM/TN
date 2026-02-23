import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

export const fetchReviews = createAsyncThunk(
    "reviews/fetch",
    async (workerId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/reviews/${workerId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load reviews");
        }
    }
);

export const postReview = createAsyncThunk(
    "reviews/post",
    async ({ workerId, rating, comment, userName }, { rejectWithValue }) => {
        try {
            const res = await api.post("/reviews", { workerId, rating, comment, userName }, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to submit review");
        }
    }
);

export const replyToReview = createAsyncThunk(
    "reviews/reply",
    async ({ reviewId, reply }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/reviews/${reviewId}/reply`, { reply }, { withCredentials: true });
            return { reviewId, reply, ...res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to post reply");
        }
    }
);

const reviewSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [],
        loading: false,
        submitLoading: false,
        replyLoading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearReviewState: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; })
            .addCase(fetchReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(postReview.pending, (state) => { state.submitLoading = true; state.error = null; })
            .addCase(postReview.fulfilled, (state) => {
                state.submitLoading = false;
                state.successMessage = "Review submitted successfully!";
            })
            .addCase(postReview.rejected, (state, action) => { state.submitLoading = false; state.error = action.payload; })

            .addCase(replyToReview.pending, (state) => { state.replyLoading = true; state.error = null; })
            .addCase(replyToReview.fulfilled, (state, action) => {
                state.replyLoading = false;
                // Update the review in-place with the new reply
                const idx = state.reviews.findIndex(r => r.id === action.payload.reviewId);
                if (idx !== -1) {
                    state.reviews[idx].workerReply = action.payload.reply;
                    state.reviews[idx].repliedAt = new Date().toISOString();
                }
                state.successMessage = "Reply posted!";
            })
            .addCase(replyToReview.rejected, (state, action) => { state.replyLoading = false; state.error = action.payload; });
    },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
