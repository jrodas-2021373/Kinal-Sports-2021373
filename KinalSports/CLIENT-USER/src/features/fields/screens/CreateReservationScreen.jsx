// src/features/fields/screens/CreateReservationScreen.jsx

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useReservations } from "../../reservations/hooks/useReservations";
import { Input, Button, Card } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const CreateReservationScreen = ({ navigation, route }) => {
  const field = route.params?.field;
  const { createReservation, loading, error } = useReservations();
  const [serverError, setServerError] = useState(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      date: "",
      time: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);

    if (!field?.id) {
      setServerError("Falta información de la cancha.");
      return;
    }

    const result = await createReservation({
      fieldId: field.id,
      date: data.date,
      time: data.time,
    });

    if (result.success) {
      Alert.alert("Reserva creada", "Tu reservación se ha creado correctamente.", [
        { text: "Aceptar", onPress: () => navigation.navigate("Reservations") },
      ]);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{field?.name || "Reservar cancha"}</Text>
        <Text style={styles.subtitle}>{field?.location || "Elige fecha y hora"}</Text>
      </Card>

      <Controller
        control={control}
        name="date"
        rules={{ required: "Seleccione una fecha" }}
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
        rules={{ required: "Seleccione un horario" }}
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
        title={loading ? "Reservando..." : "Crear reservación"}
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
