// src/features/auth/screens/RegisterScreen.jsx

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme";
import { Button, Input } from "../../../shared/components/common";
import { useAuth } from "../hooks/useAuth";

export const RegisterScreen = ({ navigation }) => {
  const { handleRegister, loading, error } = useAuth();
  const [serverError, setServerError] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);

    if (data.password !== data.confirmPassword) {
      setServerError("Las contraseñas no coinciden");
      return;
    }

    const registerData = new FormData();
    registerData.append("name", data.name);
    registerData.append("surname", data.surname);
    registerData.append("username", data.username);
    registerData.append("email", data.email);
    registerData.append("password", data.password);
    registerData.append("phone", data.phone);

    const result = await handleRegister(registerData);

    if (result.success) {
      Alert.alert(
        "Registro exitoso",
        "Tu cuenta ha sido creada. Por favor inicia sesión.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } else {
      setServerError(result.error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a KinalSports</Text>
      </View>

      <View style={styles.form}>
        {/* Nombre */}
        <Controller
          control={control}
          name="name"
          rules={{ required: "El nombre es requerido" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              editable={!loading}
            />
          )}
        />

        {/* Apellido */}
        <Controller
          control={control}
          name="surname"
          rules={{ required: "El apellido es requerido" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Apellido"
              placeholder="Tu apellido"
              value={value}
              onChangeText={onChange}
              error={errors.surname?.message}
              editable={!loading}
            />
          )}
        />

        {/* Usuario */}
        <Controller
          control={control}
          name="username"
          rules={{ required: "El usuario es requerido" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Usuario"
              placeholder="nombre_usuario"
              value={value}
              onChangeText={onChange}
              error={errors.username?.message}
              editable={!loading}
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: "El email es requerido",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              placeholder="correo@ejemplo.com"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              editable={!loading}
            />
          )}
        />

        {/* Teléfono */}
        <Controller
          control={control}
          name="phone"
          rules={{ required: "El teléfono es requerido" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Teléfono"
              placeholder="Tu número de teléfono"
              value={value}
              onChangeText={onChange}
              error={errors.phone?.message}
              keyboardType="phone-pad"
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

        {/* Confirmar Contraseña */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: "Confirma tu contraseña" }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Confirmar Contraseña"
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
              secureTextEntry
              editable={!loading}
            />
          )}
        />

        {/* Error del servidor */}
        {serverError && <Text style={styles.errorText}>{serverError}</Text>}

        {/* Botón Registrar */}
        <Button
          title={loading ? "Registrando..." : "Crear Cuenta"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />

        {/* Enlace a Login */}
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <Text
            style={[styles.loginText, styles.link]}
            onPress={() => navigation.navigate("Login")}
          >
            Inicia sesión
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  form: {
    marginBottom: SPACING.xl,
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
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.lg,
  },
  loginText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textLight,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
