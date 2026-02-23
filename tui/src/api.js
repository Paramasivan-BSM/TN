// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",        // 🔑 proxy-aware
  withCredentials: true,  // 🔑 ALWAYS send cookies
});

export default api;
