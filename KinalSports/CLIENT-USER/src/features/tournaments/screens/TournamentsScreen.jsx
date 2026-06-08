// src/features/tournaments/screens/TournamentsScreen.jsx

import React from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useTournaments } from "../hooks/useTournaments";
import { Card, Button, LoadingSpinner, EmptyState } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const TournamentsScreen = ({ navigation }) => {
  const { tournaments, loading, error, refreshTournaments } = useTournaments();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.title}>{item.name || "Torneo"}</Text>
      <Text style={styles.subtitle}>{item.location || item.city || "Ubicación no disponible"}</Text>
      <Text style={styles.detail}>{item.startDate || item.date || "Fecha no definida"}</Text>
      <Button
        title="Ver detalles"
        onPress={() => navigation.navigate("TournamentDetail", { tournament: item })}
        style={styles.button}
        variant="secondary"
      />
    </Card>
  );

  if (loading && tournaments.length === 0) {
    return <LoadingSpinner message="Cargando torneos..." />;
  }

  if (error && tournaments.length === 0) {
    return <EmptyState title="Error" message={error} />;
  }

  return (
    <FlatList
      data={tournaments}
      keyExtractor={(item) => item.id?.toString() || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshTournaments} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="Sin torneos" message="No hay torneos disponibles por ahora." />}
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
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  detail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  button: {
    alignSelf: "flex-start",
  },
});