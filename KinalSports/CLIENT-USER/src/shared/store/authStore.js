// src/shared/store/authStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "auth_refresh_token";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        try {
          if (refreshToken) {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          }
          set({
            token: accessToken,
            user,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          console.error("Error en login:", error);
          return { success: false, error };
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
          return { success: true };
        } catch (error) {
          console.error("Error en logout:", error);
          return { success: false, error };
        }
      },

      setAccessToken: (token) => {
        set({ token });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      getRefreshToken: async () => {
        try {
          return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
          console.error("Error obteniendo refresh token:", error);
          return null;
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          set({ _hasHydrated: true });
        }
      },
    }
  )
);
