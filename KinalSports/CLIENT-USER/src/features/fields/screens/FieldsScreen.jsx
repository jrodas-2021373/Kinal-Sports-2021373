// src/features/fields/screens/FieldsScreen.jsx

import React from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useFields } from "../hooks/useFields";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

export const FieldsScreen = ({ navigation }) => {
  const { fields, loading, error, refreshFields } = useFields();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("FieldDetail", { field: item })}>
      <Card style={styles.card}>
        {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>{item.location}</Text>
          <Text style={[styles.status, item.isAvailable ? styles.available : styles.unavailable]}>
            {item.isAvailable ? "Disponible" : "No disponible"}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && fields.length === 0) {
    return <LoadingSpinner message="Cargando canchas..." />;
  }

  if (error) {
    return <EmptyState title="Error" message={error} />;
  }

  return (
    <FlatList
      data={fields}
      keyExtractor={(item) => item.id?.toString() || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshFields} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="Sin canchas" message="No se encontraron campos disponibles." />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.sm,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: SPACING.md,
    backgroundColor: COLORS.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  detail: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  status: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  available: {
    color: COLORS.success,
  },
  unavailable: {
    color: COLORS.error,
  },
});
