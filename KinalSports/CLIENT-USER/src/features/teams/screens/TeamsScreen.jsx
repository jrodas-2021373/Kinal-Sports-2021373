// src/features/teams/screens/TeamsScreen.jsx

import React, { useMemo } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useTeams } from "../hooks/useTeams";
import { Card, Button, LoadingSpinner, EmptyState } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const TeamsScreen = ({ navigation }) => {
  const { teams, myTeams, loading, error, refreshTeams, joinTeam } = useTeams();
  const joinedTeamIds = useMemo(() => new Set(myTeams.map((team) => team.id)), [myTeams]);

  const handleJoin = async (teamId) => {
    await joinTeam(teamId);
  };

  const renderItem = ({ item }) => {
    const joined = joinedTeamIds.has(item.id);
    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.meta}>
            <Text style={styles.title}>{item.name || "Equipo"}</Text>
            <Text style={styles.subtitle}>{item.description || "Descripción no disponible"}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            title="Ver equipo"
            onPress={() => navigation.navigate("TeamDetail", { team: item })}
            style={styles.actionButton}
            variant="secondary"
          />
          {!joined && (
            <Button
              title="Unirme"
              onPress={() => handleJoin(item.id)}
              loading={loading}
              style={styles.actionButton}
            />
          )}
        </View>
      </Card>
    );
  };

  if (loading && teams.length === 0) {
    return <LoadingSpinner message="Cargando equipos..." />;
  }

  if (error && teams.length === 0) {
    return <EmptyState title="Error" message={error} />;
  }

  return (
    <View style={styles.container}>
      <Button
        title="Crear equipo"
        onPress={() => navigation.navigate("CreateTeam")}
        style={styles.createButton}
      />
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id?.toString() || item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshTeams} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          <EmptyState
            title="Sin equipos"
            message="No hay equipos disponibles. Crea uno o únete a uno existente."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  createButton: {
    marginBottom: SPACING.md,
  },
  list: {
    paddingBottom: SPACING.lg,
  },
  card: {
    padding: SPACING.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  meta: {
    flex: 1,
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
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
});