// src/features/teams/hooks/useTeams.js

import { useState, useEffect, useCallback } from "react";
import userClient from "../../../shared/api/userClient";
import { useAuthStore } from "../../../shared/store/authStore";

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || user?._id || null;

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.get("/teams");
      const data = response.data.data || response.data;
      setTeams(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error cargando equipos");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyTeams = useCallback(async () => {
    if (!userId) {
      setMyTeams([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userClient.get("/teams/me/mis-equipos");
      const data = response.data.data || response.data;
      setMyTeams(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error cargando mis equipos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTeams();
    loadMyTeams();
  }, [loadTeams, loadMyTeams]);

  const joinTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.post(`/teams/${teamId}/join`);
      await loadMyTeams();
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al unirse al equipo");
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [loadMyTeams]);

  const leaveTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.post(`/teams/${teamId}/leave`);
      await loadMyTeams();
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al salir del equipo");
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [loadMyTeams]);

  const createTeam = useCallback(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.post("/teams", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadMyTeams();
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error creando equipo");
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [loadMyTeams]);

  return {
    teams,
    myTeams,
    loading,
    error,
    refreshTeams: loadTeams,
    refreshMyTeams: loadMyTeams,
    joinTeam,
    leaveTeam,
    createTeam,
  };
};
