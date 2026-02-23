import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

export const registerWorker = createAsyncThunk(
    "worker/register",
    async (workerData, { rejectWithValue }) => {
        try {
            const res = await api.post("/worker/register", workerData, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Registration failed");
        }
    }
);

export const fetchWorkerProfile = createAsyncThunk(
    "worker/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/worker/me", { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load profile");
        }
    }
);

export const updateWorkerProfile = createAsyncThunk(
    "worker/updateProfile",
    async (workerData, { rejectWithValue }) => {
        try {
            const res = await api.put("/worker/update", workerData, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Update failed");
        }
    }
);

const workerSlice = createSlice({
    name: "worker",
    initialState: {
        loading: false,
        error: null,
        success: false,
        updateSuccess: false,
        workerData: null,     // the worker's own profile
    },
    reducers: {
        resetWorkerState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.updateSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // register
            .addCase(registerWorker.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(registerWorker.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(registerWorker.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })

            // fetch profile
            .addCase(fetchWorkerProfile.pending, (state) => { state.loading = true; })
            .addCase(fetchWorkerProfile.fulfilled, (state, action) => { state.loading = false; state.workerData = action.payload; })
            .addCase(fetchWorkerProfile.rejected, (state) => { state.loading = false; state.workerData = null; })

            // update profile
            .addCase(updateWorkerProfile.pending, (state) => { state.loading = true; state.error = null; state.updateSuccess = false; })
            .addCase(updateWorkerProfile.fulfilled, (state) => { state.loading = false; state.updateSuccess = true; })
            .addCase(updateWorkerProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.updateSuccess = false; });
    },
});

export const { resetWorkerState } = workerSlice.actions;
export default workerSlice.reducer;
