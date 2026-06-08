// src/features/tournaments/screens/TournamentDetailScreen.jsx

import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useTournaments } from "../hooks/useTournaments";
import { useTeams } from "../../teams/hooks/useTeams";
import { Button, Card } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const TournamentDetailScreen = ({ route }) => {
  const tournament = route.params?.tournament;
  const { registerTeam, loading, error } = useTournaments();
  const { myTeams } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState(myTeams[0]?.id || null);

  const selectedTeam = useMemo(
    () => myTeams.find((team) => team.id === selectedTeamId) || null,
    [myTeams, selectedTeamId]
  );

  if (!tournament) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>No se encontró el torneo.</Text>
      </View>
    );
  }

  const handleRegister = async () => {
    if (!selectedTeamId) {
      Alert.alert("Selecciona un equipo", "Debes seleccionar un equipo para inscribirte.");
      return;
    }

    const result = await registerTeam(tournament.id, selectedTeamId);
    if (result.success) {
      Alert.alert("Registro exitoso", "Tu equipo fue inscrito al torneo.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{tournament.name || "Torneo"}</Text>
        <Text style={styles.subtitle}>{tournament.location || tournament.city || "Ubicación"}</Text>
        <Text style={styles.detail}>Inicio: {tournament.startDate || tournament.date || "Pendiente"}</Text>
        <Text style={styles.detail}>Modalidad: {tournament.format || tournament.type || "No especificado"}</Text>
        <Text style={styles.description}>{tournament.description || "No hay más información disponible."}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Mi equipo</Text>
        {myTeams.length === 0 ? (
          <Text style={styles.subtitle}>Necesitas crear o unirte a un equipo antes de inscribirte.</Text>
        ) : (
          myTeams.map((team) => (
            <TouchableOpacity
              key={team.id}
              style={[styles.teamOption, selectedTeamId === team.id && styles.teamOptionSelected]}
              onPress={() => setSelectedTeamId(team.id)}
            >
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamMeta}>{team.description || "Equipo"}</Text>
            </TouchableOpacity>
          ))
        )}
      </Card>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={loading ? "Registrando..." : "Inscribir equipo"}
        onPress={handleRegister}
        disabled={!myTeams.length || loading}
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
    marginBottom: SPACING.sm,
  },
  detail: {
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  teamOption: {
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  teamOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}12`,
  },
  teamName: {
    fontSize: FONT_SIZE.base,
    fontWeight: "700",
    color: COLORS.text,
  },
  teamMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
});