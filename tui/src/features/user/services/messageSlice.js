import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

export const sendMessage = createAsyncThunk(
    "messages/send",
    async ({ receiverId, content }, { rejectWithValue }) => {
        try {
            const res = await api.post("/messages/send", { receiverId, content }, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to send message");
        }
    }
);

export const fetchConversation = createAsyncThunk(
    "messages/fetchConversation",
    async (otherEmail, { rejectWithValue }) => {
        try {
            const res = await api.get(`/messages/conversation/${encodeURIComponent(otherEmail)}`, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load conversation");
        }
    }
);

export const fetchInbox = createAsyncThunk(
    "messages/fetchInbox",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/messages/inbox", { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load inbox");
        }
    }
);

const messageSlice = createSlice({
    name: "messages",
    initialState: {
        messages: [],
        inbox: [],
        loading: false,
        inboxLoading: false,
        sending: false,
        error: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.messages = [];
            state.error = null;
        },
        appendMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversation.pending, (state) => { state.loading = true; })
            .addCase(fetchConversation.fulfilled, (state, action) => { state.loading = false; state.messages = action.payload; })
            .addCase(fetchConversation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(sendMessage.pending, (state) => { state.sending = true; })
            .addCase(sendMessage.fulfilled, (state) => { state.sending = false; })
            .addCase(sendMessage.rejected, (state, action) => { state.sending = false; state.error = action.payload; })

            .addCase(fetchInbox.pending, (state) => { state.inboxLoading = true; })
            .addCase(fetchInbox.fulfilled, (state, action) => { state.inboxLoading = false; state.inbox = action.payload; })
            .addCase(fetchInbox.rejected, (state, action) => { state.inboxLoading = false; state.error = action.payload; });
    },
});

export const { clearMessages, appendMessage } = messageSlice.actions;
export default messageSlice.reducer;
