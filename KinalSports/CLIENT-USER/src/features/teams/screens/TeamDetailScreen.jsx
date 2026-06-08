// src/features/teams/screens/TeamDetailScreen.jsx

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useTeams } from "../hooks/useTeams";
import { Button, Card } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const TeamDetailScreen = ({ route, navigation }) => {
  const team = route.params?.team;
  const { myTeams, joinTeam, leaveTeam, loading, error } = useTeams();
  const isMember = useMemo(
    () => myTeams.some((currentTeam) => currentTeam.id === team?.id),
    [myTeams, team]
  );

  if (!team) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>No se encontró el equipo.</Text>
      </View>
    );
  }

  const handleAction = async () => {
    const result = isMember ? await leaveTeam(team.id) : await joinTeam(team.id);
    if (result.success) {
      Alert.alert(
        "Equipo actualizado",
        isMember ? "Has salido del equipo." : "Ahora formas parte del equipo.",
        [{ text: "Aceptar", onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{team.name || "Equipo"}</Text>
        <Text style={styles.subtitle}>{team.description || "Sin descripción"}</Text>
        <Text style={styles.detail}>Miembros: {team.membersCount || team.memberCount || "-"}</Text>
      </Card>

      <Button
        title={isMember ? "Salir del equipo" : "Unirme al equipo"}
        onPress={handleAction}
        loading={loading}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    marginBottom: SPACING.sm,
  },
  detail: {
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
});