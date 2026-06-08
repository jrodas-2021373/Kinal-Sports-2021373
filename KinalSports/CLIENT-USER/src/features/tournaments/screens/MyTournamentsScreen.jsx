// src/features/tournaments/screens/MyTournamentsScreen.jsx

import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useTournaments } from "../hooks/useTournaments";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const MyTournamentsScreen = () => {
  const { myTournaments, loading, error, refreshMyTournaments } = useTournaments();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.title}>{item.name || "Torneo"}</Text>
      <Text style={styles.subtitle}>{item.location || item.city || "Ubicación no disponible"}</Text>
      <Text style={styles.detail}>Inicio: {item.startDate || item.date || "Pendiente"}</Text>
    </Card>
  );

  if (loading && myTournaments.length === 0) {
    return <LoadingSpinner message="Cargando tus torneos..." />;
  }

  if (error && myTournaments.length === 0) {
    return <EmptyState title="Error" message={error} />;
  }

  return (
    <FlatList
      data={myTournaments}
      keyExtractor={(item) => item.id?.toString() || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshMyTournaments} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="Sin inscripciones" message="Aún no estás inscrito en ningún torneo." />}
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
  },
});