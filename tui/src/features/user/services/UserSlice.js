import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api"; // Adjusted path to match context

export const fetchSkills = createAsyncThunk(
    "userScreen/fetchSkills",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/recommend/skills", {
                withCredentials: true

            });
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch skills"
            );
        }
    }
);

export const switchUserType = createAsyncThunk(
    "userscreen/switchUserType",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // 1. Request to switch the type in the database
            await api.post("/user/switchtype", {}, { withCredentials: true });

            // 2. Immediately trigger a token refresh to update the client's token with new permissions
            const refreshResponse = await api.post("/user/refresh", { withCredentials: true });

            return refreshResponse.data; // Expected: { message: "...", data: { role: "WORKER", ... } }
        } catch (err) {
            console.error("Error switching user type:", err);
            return rejectWithValue(err.response?.data || "Switch failed");
        }
    }
);

const userSlice = createSlice({
    name: "userscreen",
    initialState: {
        menuAnchor: null,
        serviceType: null,
        skills: [],
        loading: false,
        error: null,
        userRole: null // Added to track current role
    },

    reducers: {
        toggleMenu: (state, action) => {
            state.menuAnchor = action.payload;
        },
        closeMenu: (state) => {
            state.menuAnchor = null;
        },
        selectService: (state, action) => {
            state.serviceType = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch Skills
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.skills = action.payload;
            })
            .addCase(fetchSkills.rejected, (state, action) => {
                state.skills = []; // Clear skills on failure
            })

            // Switch User Type
            .addCase(switchUserType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(switchUserType.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming the backend sends back the new role in action.payload.data
                // or if the backend structure is different, adjust accordingly.
                // Based on UserController: body(new MessageResponse(..., user.getRole()))
                // Assuming payload is { message, data: { role: "WORKER", ... } }
                state.userRole = action.payload?.data?.role || "WORKER";

                // Optionally update token in localStorage if it was returned in the body
                // But usually cookies handle it.
            })
            .addCase(switchUserType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { toggleMenu, closeMenu, selectService } = userSlice.actions;
export default userSlice.reducer;
