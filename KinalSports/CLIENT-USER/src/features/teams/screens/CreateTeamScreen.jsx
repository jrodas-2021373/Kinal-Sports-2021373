// src/features/teams/screens/CreateTeamScreen.jsx

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useTeams } from "../hooks/useTeams";
import { Input, Button, Card } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const CreateTeamScreen = ({ navigation }) => {
  const { createTeam, loading, error } = useTeams();
  const [serverError, setServerError] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", description: "" } });

  const onSubmit = async (data) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    const result = await createTeam(formData);
    if (result.success) {
      Alert.alert("Equipo creado", "Tu equipo se ha creado correctamente.", [
        { text: "Aceptar", onPress: () => navigation.navigate("MyTeams") },
      ]);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Crear equipo</Text>
        <Text style={styles.subtitle}>Completa la información para crear tu equipo.</Text>
      </Card>

      <Controller
        control={control}
        name="name"
        rules={{ required: "El nombre del equipo es obligatorio" }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Nombre del equipo"
            placeholder="Ej. Furia Kinal"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
            editable={!loading}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{ required: "La descripción es obligatoria" }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Descripción"
            placeholder="Describe tu equipo"
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        )}
      />

      {serverError && <Text style={styles.errorText}>{serverError}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title={loading ? "Creando equipo..." : "Crear equipo"}
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