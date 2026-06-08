// src/shared/api/authClient.js

import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "../store/authStore";

const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_URL || "http://localhost:3007/api/v1/auth";

const authClient = axios.create({
  baseURL: AUTH_BASE_URL.split("/auth")[0],
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cola de peticiones en espera durante refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
authClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No refrescar en endpoints de auth críticos
    const noRefreshEndpoints = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/resend-verification"];
    const shouldNotRefresh = noRefreshEndpoints.some((endpoint) => originalRequest.url.includes(endpoint));

    if (error.response?.status === 401 && !shouldNotRefresh && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authClient(originalRequest);
          })
          .catch(async (err) => {
            await useAuthStore.getState().logout();
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await useAuthStore.getState().getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${ENDPOINTS.AUTH.split("/login")[0]}/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        useAuthStore.getState().setAccessToken(accessToken);

        if (newRefreshToken) {
          const state = useAuthStore.getState();
          await state.getRefreshToken(); // Actualizar en SecureStore si es necesario
        }

        authClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return authClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default authClient;
