// src/shared/components/common/Common.jsx

import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../constants/theme";

export const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

export const EmptyState = ({ 
  icon = "inbox", 
  title = "Sin contenido",
  message = "No hay elementos para mostrar",
  actionButton = null,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name={icon} size={64} color={COLORS.textLight} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {actionButton && <View style={{ marginTop: SPACING.lg }}>{actionButton}</View>}
    </View>
  );
};

export const Card = ({ children, style, onPress }) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      style={[styles.card, style]}
      onPress={onPress}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyMessage: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
});
