// src/features/fields/screens/FieldDetailScreen.jsx

import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Button, Card } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const FieldDetailScreen = ({ route, navigation }) => {
  const field = route.params?.field;

  if (!field) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró la cancha.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        {field.image ? <Image source={{ uri: field.image }} style={styles.image} /> : null}
        <Text style={styles.title}>{field.name}</Text>
        <Text style={styles.subtitle}>{field.location}</Text>
        <Text style={styles.status}>{field.isAvailable ? "Disponible" : "No disponible"}</Text>
      </Card>

      <Card style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.text}>{field.raw?.description || "No hay descripción disponible."}</Text>
      </Card>

      <Button
        title="Reservar cancha"
        onPress={() => navigation.navigate("CreateReservation", { field })}
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
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.border,
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
    marginBottom: SPACING.sm,
  },
  status: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
  detailsCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  text: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.lg,
  },
});
