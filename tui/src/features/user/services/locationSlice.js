import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

/* =========================
   FETCH USER LOCATION
========================= */
export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async (_, { rejectWithValue }) => {
    try {
      if (!navigator.geolocation) {
        return rejectWithValue("Geolocation not supported");
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================
   FETCH WORKERS BY SKILL + LOCATION
========================= */
export const fetchWorkers = createAsyncThunk(
  "location/fetchWorkers",
  async ({ serviceType, latitude, longitude }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/recommend?lat=${latitude}&lng=${longitude}&skill=${serviceType}`,
        { withCredentials: true }
      );

      console.log("✅ Workers API response:", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch workers"
      );
    }
  }
);

/* =========================  
   SLICE
========================= */
const locationSlice = createSlice({
  name: "location",
  initialState: {
    latitude: sessionStorage.getItem("latitude")
      ? Number(sessionStorage.getItem("latitude"))
      : null,

    longitude: sessionStorage.getItem("longitude")
      ? Number(sessionStorage.getItem("longitude"))
      : null,

    workers: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* LOCATION */
      .addCase(fetchLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;

        sessionStorage.setItem("latitude", action.payload.latitude);
        sessionStorage.setItem("longitude", action.payload.longitude);
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* WORKERS */
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default locationSlice.reducer;
