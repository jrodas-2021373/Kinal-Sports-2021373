// src/features/auth/hooks/useAuth.js

import { useState } from "react";
import { useAuthStore } from "../../../shared/store/authStore";
import authClient from "../../../shared/api/authClient";
import { ENDPOINTS } from "../../../shared/constants/endpoints";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      const { accessToken, token, refreshToken, userDetails, user } = response.data;

      // Tolerar diferentes nombres de propiedades
      const finalToken = accessToken || token;
      const finalUser = userDetails || user;

      if (!finalToken || !finalUser) {
        throw new Error("Respuesta de servidor inválida");
      }

      await login(finalToken, finalUser, refreshToken);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error en login";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const handleRegister = async (registerData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authClient.post(ENDPOINTS.AUTH.REGISTER, registerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error en registro";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Error en logout";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    handleLogin,
    handleRegister,
    logout: handleLogout,
    loading,
    error,
  };
};
