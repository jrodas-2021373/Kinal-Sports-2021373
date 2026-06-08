// src/features/fields/hooks/useFields.js

import { useState, useEffect, useCallback } from "react";
import userClient from "../../../shared/api/userClient";

export const useFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFields = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.get("/fields");
      const data = response.data.data || response.data;
      const mappedFields = (data || []).map((field) => ({
        id: field.id || field._id,
        name: field.name || field.fieldName || "Cancha",
        image: field.image || field.photo || null,
        location: `${field.type || field.fieldType || "Tipo"} • ${field.capacity || field.capacity || "?"}`,
        isAvailable: Boolean(field.isActive || field.available),
        raw: field,
      }));
      setFields(mappedFields);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error cargando canchas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  return {
    fields,
    loading,
    error,
    refreshFields: loadFields,
  };
};
