// src/features/reservations/hooks/useReservations.js

import { useState, useEffect, useCallback } from "react";
import userClient from "../../../shared/api/userClient";

export const useReservations = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.get("/reservations/me/history");
      const data = response.data.data || response.data;
      const mapped = (data || []).map((item) => ({
        id: item.id || item._id,
        field: {
          id: item.field?.id || item.field?._id || item.fieldId,
          name: item.field?.name || item.fieldName || "Cancha",
          image: item.field?.image || item.field?.photo || null,
        },
        normalizedStatus: (item.status || "").toUpperCase(),
        date: item.date || item.reservationDate || "-",
        time: item.time || item.hour || "-",
        raw: item,
      }));
      setHistory(mapped);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error cargando reservaciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const createReservation = useCallback(async (reservationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.post("/reservations", reservationData);
      const result = response.data.data || response.data;
      await loadHistory();
      return { success: true, data: result };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error creando reservación");
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  const cancelReservation = useCallback(async (reservationId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.put(`/reservations/${reservationId}/cancel`);
      const result = response.data.data || response.data;
      await loadHistory();
      return { success: true, data: result };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error cancelando reservación");
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  return {
    history,
    loading,
    error,
    refreshHistory: loadHistory,
    createReservation,
    cancelReservation,
  };
};
