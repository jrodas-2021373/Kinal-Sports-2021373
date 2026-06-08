// src/features/tournaments/hooks/useTournaments.js

import { useState, useEffect, useCallback } from "react";
import userClient from "../../../shared/api/userClient";

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.get("/tournaments");
      const data = response.data.data || response.data;
      setTournaments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error cargando torneos");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.get("/tournaments/my-tournaments");
      const data = response.data.data || response.data;
      setMyTournaments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error cargando mis torneos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTournaments();
    loadMyTournaments();
  }, [loadTournaments, loadMyTournaments]);

  const registerTeam = useCallback(async (tournamentId, teamId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.post(`/tournaments/register/${tournamentId}`, { teamId });
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error registrando equipo");
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tournaments,
    myTournaments,
    loading,
    error,
    refreshTournaments: loadTournaments,
    refreshMyTournaments: loadMyTournaments,
    registerTeam,
  };
};
