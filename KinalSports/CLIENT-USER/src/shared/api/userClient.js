// src/shared/api/userClient.js

import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";
import { useAuthStore } from "../store/authStore";

const USER_BASE_URL = process.env.EXPO_PUBLIC_USER_URL || "http://localhost:3008/kinalSportsUser/v1";

const userClient = axios.create({
  baseURL: USER_BASE_URL.split("/v1")[0],
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
userClient.interceptors.request.use(
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
userClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return userClient(originalRequest);
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

        const authBaseURL = ENDPOINTS.AUTH.split("/login")[0];
        const response = await axios.post(`${authBaseURL}/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        useAuthStore.getState().setAccessToken(accessToken);

        if (newRefreshToken) {
          const state = useAuthStore.getState();
          await state.getRefreshToken();
        }

        userClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return userClient(originalRequest);
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

export default userClient;
