// src/features/teams/screens/MyTeamsScreen.jsx

import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTeams } from "../hooks/useTeams";
import { Card, Button, LoadingSpinner, EmptyState } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const MyTeamsScreen = ({ navigation }) => {
  const { myTeams, loading, error, refreshMyTeams, leaveTeam } = useTeams();

  const handleLeave = async (teamId) => {
    await leaveTeam(teamId);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.title}>{item.name || "Equipo"}</Text>
      <Text style={styles.subtitle}>{item.description || "Sin descripción"}</Text>
      <Button
        title="Ver detalle"
        onPress={() => navigation.navigate("TeamDetail", { team: item })}
        variant="secondary"
        style={styles.button}
      />
      <Button
        title="Salir"
        onPress={() => handleLeave(item.id)}
        loading={loading}
        style={styles.button}
      />
    </Card>
  );

  if (loading && myTeams.length === 0) {
    return <LoadingSpinner message="Cargando mis equipos..." />;
  }

  if (error && myTeams.length === 0) {
    return <EmptyState title="Error" message={error} />;
  }

  return (
    <FlatList
      data={myTeams}
      keyExtractor={(item) => item.id?.toString() || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshMyTeams} tintColor={COLORS.primary} />}
      ListEmptyComponent={
        <EmptyState
          title="Aún no perteneces a un equipo"
          message="Crea un equipo o únete a uno disponible."
          actionButton={
            <Button title="Buscar equipos" onPress={() => navigation.navigate("TeamsList")} />
          }
        />
      }
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
    marginBottom: SPACING.sm,
  },
  button: {
    marginBottom: SPACING.sm,
  },
});