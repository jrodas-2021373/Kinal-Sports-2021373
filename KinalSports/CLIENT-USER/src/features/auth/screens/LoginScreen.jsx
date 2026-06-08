// src/features/auth/screens/LoginScreen.jsx

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { Button, Input } from "../../../shared/components/common";
import { useAuth } from "../hooks/useAuth";

export const LoginScreen = ({ navigation }) => {
  const { handleLogin, loading, error } = useAuth();
  const [serverError, setServerError] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    const result = await handleLogin(data);

    if (!result.success) {
      setServerError(result.error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../../assets/kinal_sports.png")}
          style={styles.logo}
          defaultSource={require("../../../../assets/icon.png")}
        />
        <Text style={styles.title}>KinalSports</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>

        {/* Email o Usuario */}
        <Controller
          control={control}
          name="emailOrUsername"
          rules={{ required: "El email o usuario es requerido" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email o Usuario"
              placeholder="correo@ejemplo.com o usuario"
              value={value}
              onChangeText={onChange}
              error={errors.emailOrUsername?.message}
              keyboardType="email-address"
              editable={!loading}
            />
          )}
        />

        {/* Contraseña */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: "La contraseña es requerida",
            minLength: { value: 8, message: "Mínimo 8 caracteres" },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
              editable={!loading}
            />
          )}
        />

        {/* Error del servidor */}
        {serverError && <Text style={styles.errorText}>{serverError}</Text>}

        {/* Botón Login */}
        <Button
          title={loading ? "Iniciando..." : "Iniciar Sesión"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />

        {/* Enlace a Registro */}
        <View style={styles.registerLink}>
          <Text style={styles.registerText}>¿No tienes cuenta? </Text>
          <Text
            style={[styles.registerText, styles.link]}
            onPress={() => navigation.navigate("Register")}
          >
            Regístrate aquí
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: SPACING.md,
    borderRadius: 40,
  },
  title: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: "bold",
    color: COLORS.primary,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  button: {
    marginTop: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  registerLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.lg,
  },
  registerText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
