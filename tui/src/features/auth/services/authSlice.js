import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../api";

const baseURL = "http://localhost:8080";

/* =========================
   SIGNUP
========================= */
export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`/auth/signup`, data);
      return res.data; // { msg, status }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Signup failed"
      );
    }
  }
);

/* =========================
   LOGIN
========================= */
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`/auth/login`, data,{ withCredentials: true });
      console.log(res.data);
      
      return res.data; // { msg, token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Invalid email or password"
      );
    }
  }
);


// Logout

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {     
    try {
      const res = await api.post(`/auth/logout`, {}, { withCredentials: true });
      return res.data; // { msg }
    }
    catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Logout failed"
      );
    }       
  });





export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      console.log("Auth check response:", res.data);
      return res.data; // { email, role }
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
 initialState: {
  formtype: "signin",
  message: null,
  error: null,
  loading: false,

  signupUserType:"USER",

  // auth state
  isAuthenticated: false,
  role: null,
  email: null,

  authChecked: false, // 🔑 critical
},

  reducers: {
    swipeForm: (state) => {
      state.formtype = state.formtype === "signin" ? "signup" : "signin";
      state.message = null;
      state.error = null;
    },
    resetAuthState: (state) => {
      state.message = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* SIGNUP */
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.msg;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.msg;
        state.isAuthenticated = action.payload.status;
        state.role = action.payload.role; // Store user role
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        /* CHECK AUTH */
.addCase(checkAuth.fulfilled, (state, action) => {
  state.loading = false;
  state.isAuthenticated = true;
  state.role = action.payload.role;
  state.email = action.payload.email;
  state.authChecked = true;
})
.addCase(checkAuth.rejected, (state) => {
  state.loading = false;
  state.isAuthenticated = false;
  state.role = null;
  state.email = null;
  state.authChecked = true;
})
.addCase(checkAuth.pending, (state) => {
  state.loading = true;
  state.authChecked = false; // 👈 add this
})

// logout
.addCase(logout.pending, (state) => {
  state.loading = true;
})
.addCase(logout.fulfilled, (state, action) => {
  state.loading = false;
  state.isAuthenticated = false;
  state.role = null;
  state.email = null;
  state.message = action.payload.msg;
})
.addCase(logout.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;   


 
})

  }});

export const { swipeForm, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
