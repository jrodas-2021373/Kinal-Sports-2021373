// src/features/reservations/screens/CreateReservationScreen.jsx

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useReservations } from "../hooks/useReservations";
import { Input, Button, Card } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const CreateReservationScreen = ({ navigation }) => {
  const { createReservation, loading, error } = useReservations();
  const [serverError, setServerError] = useState(null);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fieldId: "",
      date: "",
      time: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);

    const result = await createReservation({
      fieldId: data.fieldId,
      date: data.date,
      time: data.time,
    });

    if (result.success) {
      Alert.alert("Reservación creada", "Tu reservación ha sido creada.", [
        { text: "Aceptar", onPress: () => navigation.goBack() },
      ]);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Crear reservación</Text>
        <Text style={styles.subtitle}>Ingresa los detalles de la cancha y horario.</Text>
      </Card>

      <Controller
        control={control}
        name="fieldId"
        rules={{ required: "El id de la cancha es obligatorio" }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="ID de cancha"
            placeholder="Identificador de la cancha"
            value={value}
            onChangeText={onChange}
            error={errors.fieldId?.message}
            editable={!loading}
          />
        )}
      />

      <Controller
        control={control}
        name="date"
        rules={{ required: "La fecha es obligatoria" }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Fecha"
            placeholder="YYYY-MM-DD"
            value={value}
            onChangeText={onChange}
            error={errors.date?.message}
            editable={!loading}
          />
        )}
      />

      <Controller
        control={control}
        name="time"
        rules={{ required: "El horario es obligatorio" }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Horario"
            placeholder="HH:MM"
            value={value}
            onChangeText={onChange}
            error={errors.time?.message}
            editable={!loading}
          />
        )}
      />

      {serverError && <Text style={styles.errorText}>{serverError}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title={loading ? "Creando..." : "Crear reservación"}
        onPress={handleSubmit(onSubmit)}
        loading={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  card: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
});
