// src/features/app/screens/HomeScreen.jsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>App autenticada</Text>
      <Text style={styles.subtitle}>Aquí irá el contenido principal de KinalSports.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE["3xl"],
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    textAlign: "center",
  },
});
