// src/features/profile/screens/ProfileScreen.jsx

import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "../../../shared/store/authStore";
import userClient from "../../../shared/api/userClient";
import { ENDPOINTS } from "../../../shared/constants/endpoints";
import { Card, Input, Button, LoadingSpinner } from "../../../shared/components/common";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/theme";

const defaultAvatar = require("../../../../assets/avatarDefault.png");

export const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: "",
      phone: "",
      favoriteSports: "",
    },
  });

  const avatarSource = useMemo(() => {
    const avatarUrl = profile?.avatar || profile?.photo || profile?.image;
    if (typeof avatarUrl === "string" && avatarUrl.startsWith("http")) {
      return { uri: avatarUrl };
    }
    return defaultAvatar;
  }, [profile]);

  const loadProfile = async () => {
    setLoading(true);
    setServerError(null);

    try {
      const response = await userClient.get(ENDPOINTS.USER.PROFILE);
      const data = response.data.data || response.data;
      const profileData = data || {};

      setProfile(profileData);
      reset({
        displayName: profileData.displayName || profileData.name || "",
        phone: profileData.phone || profileData.mobile || "",
        favoriteSports: Array.isArray(profileData.favoriteSports)
          ? profileData.favoriteSports.join(", ")
          : profileData.favoriteSports || "",
      });
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || "Error cargando perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setServerError(null);

    try {
      const favoriteSports = (formData.favoriteSports || "")
        .split(",")
        .map((sport) => sport.trim())
        .filter(Boolean);

      const payload = {
        displayName: formData.displayName,
        phone: formData.phone,
        favoriteSports,
      };

      const response = await userClient.put(ENDPOINTS.USER.UPDATE_PROFILE, payload);
      const updatedProfile = response.data.data || response.data || payload;
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setIsEditing(false);
      Alert.alert("Perfil actualizado", "Tus datos se actualizaron correctamente.");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Error actualizando perfil";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: () => logout() },
    ]);
  };

  const handleCancelEdit = () => {
    if (profile) {
      reset({
        displayName: profile.displayName || profile.name || "",
        phone: profile.phone || profile.mobile || "",
        favoriteSports: Array.isArray(profile.favoriteSports)
          ? profile.favoriteSports.join(", ")
          : profile.favoriteSports || "",
      });
    }
    setIsEditing(false);
    setServerError(null);
  };

  if (loading && !profile) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Image source={avatarSource} style={styles.avatar} />
        <Text style={styles.title}>{profile?.displayName || profile?.name || "Mi perfil"}</Text>
        <Text style={styles.subtitle}>{profile?.email || "Correo no disponible"}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Información personal</Text>

        <Controller
          control={control}
          name="displayName"
          rules={{ required: "El nombre para mostrar es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nombre visible"
              placeholder="Tu nombre"
              value={value}
              onChangeText={onChange}
              error={errors.displayName?.message}
              editable={isEditing}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Teléfono"
              placeholder="+502 1234 5678"
              value={value}
              onChangeText={onChange}
              error={errors.phone?.message}
              keyboardType="phone-pad"
              editable={isEditing}
            />
          )}
        />

        <Controller
          control={control}
          name="favoriteSports"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Deportes favoritos"
              placeholder="Fútbol, Baloncesto, Tenis"
              value={value}
              onChangeText={onChange}
              error={errors.favoriteSports?.message}
              editable={isEditing}
            />
          )}
        />

        {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

        <View style={styles.actions}>
          <Button
            title={isEditing ? "Guardar cambios" : "Editar perfil"}
            onPress={isEditing ? handleSubmit(handleUpdate) : () => setIsEditing(true)}
            loading={loading}
            style={styles.button}
          />
          {isEditing ? (
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={handleCancelEdit}
              disabled={loading}
              style={styles.button}
            />
          ) : null}
        </View>
      </Card>

      <Button
        title="Cerrar sesión"
        variant="secondary"
        onPress={handleLogout}
        style={styles.logoutButton}
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
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
    marginBottom: SPACING.md,
    backgroundColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE["2xl"],
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actions: {
    marginTop: SPACING.lg,
  },
  button: {
    marginBottom: SPACING.sm,
  },
  logoutButton: {
    width: "100%",
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
});
