// src/features/reservations/screens/ReservationsScreen.jsx

import React from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useReservations } from "../hooks/useReservations";
import { Card, LoadingSpinner, EmptyState, Button } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const ReservationsScreen = () => {
  const { history, loading, error, refreshHistory, cancelReservation } = useReservations();

  const handleCancel = async (reservationId) => {
    await cancelReservation(reservationId);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.fieldName}>{item.field.name}</Text>
      <Text style={styles.detail}>{item.date} · {item.time}</Text>
      <Text style={styles.status}>{item.normalizedStatus}</Text>
      {item.normalizedStatus !== "CANCELLED" && item.normalizedStatus !== "COMPLETED" ? (
        <Button title="Cancelar" onPress={() => handleCancel(item.id)} style={styles.button} />
      ) : null}
    </Card>
  );

  if (loading && history.length === 0) {
    return <LoadingSpinner message="Cargando historial..." />;
  }

  if (error) {
    return <EmptyState title="Error" message={error} />;
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id?.toString() || item.field.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshHistory} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="Sin reservaciones" message="Aún no tienes reservaciones." />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  fieldName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  detail: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  status: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  button: {
    marginTop: SPACING.sm,
  },
});
