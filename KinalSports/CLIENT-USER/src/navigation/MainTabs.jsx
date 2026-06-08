// src/navigation/MainTabs.jsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT_SIZE, SPACING } from "../shared/constants/theme";
import { FieldsScreen } from "../features/fields/screens/FieldsScreen";
import { FieldDetailScreen } from "../features/fields/screens/FieldDetailScreen";
import { CreateReservationScreen as FieldCreateReservationScreen } from "../features/fields/screens/CreateReservationScreen";
import { ReservationsScreen } from "../features/reservations/screens/ReservationsScreen";
import { TeamsScreen } from "../features/teams/screens/TeamsScreen";
import { TeamDetailScreen } from "../features/teams/screens/TeamDetailScreen";
import { MyTeamsScreen } from "../features/teams/screens/MyTeamsScreen";
import { CreateTeamScreen } from "../features/teams/screens/CreateTeamScreen";
import { TournamentsScreen } from "../features/tournaments/screens/TournamentsScreen";
import { TournamentDetailScreen } from "../features/tournaments/screens/TournamentDetailScreen";
import { MyTournamentsScreen } from "../features/tournaments/screens/MyTournamentsScreen";
import { ProfileScreen } from "../features/profile/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const FieldsStack = createNativeStackNavigator();
const TeamsStack = createNativeStackNavigator();
const TournamentsStack = createNativeStackNavigator();
const ReservationsStack = createNativeStackNavigator();

const FieldsStackScreen = () => (
  <FieldsStack.Navigator>
    <FieldsStack.Screen name="FieldsList" component={FieldsScreen} options={{ title: "Canchas" }} />
    <FieldsStack.Screen name="FieldDetail" component={FieldDetailScreen} options={{ title: "Detalle de Cancha" }} />
    <FieldsStack.Screen name="CreateReservation" component={FieldCreateReservationScreen} options={{ title: "Reservar Cancha" }} />
  </FieldsStack.Navigator>
);

const TeamsStackScreen = () => (
  <TeamsStack.Navigator>
    <TeamsStack.Screen name="TeamsList" component={TeamsScreen} options={{ title: "Equipos" }} />
    <TeamsStack.Screen name="TeamDetail" component={TeamDetailScreen} options={{ title: "Detalle de Equipo" }} />
    <TeamsStack.Screen name="MyTeams" component={MyTeamsScreen} options={{ title: "Mis Equipos" }} />
    <TeamsStack.Screen name="CreateTeam" component={CreateTeamScreen} options={{ title: "Crear Equipo" }} />
  </TeamsStack.Navigator>
);

const TournamentsStackScreen = () => (
  <TournamentsStack.Navigator>
    <TournamentsStack.Screen name="TournamentsList" component={TournamentsScreen} options={{ title: "Torneos" }} />
    <TournamentsStack.Screen name="TournamentDetail" component={TournamentDetailScreen} options={{ title: "Detalle de Torneo" }} />
    <TournamentsStack.Screen name="MyTournaments" component={MyTournamentsScreen} options={{ title: "Mis Torneos" }} />
  </TournamentsStack.Navigator>
);

const ReservationsStackScreen = () => (
  <ReservationsStack.Navigator>
    <ReservationsStack.Screen name="ReservationsList" component={ReservationsScreen} options={{ title: "Reservaciones" }} />
  </ReservationsStack.Navigator>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === "Profile",
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.sm,
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = "sports-soccer";

          if (route.name === "Fields") {
            iconName = "sports-soccer";
          } else if (route.name === "Teams") {
            iconName = "groups";
          } else if (route.name === "Tournaments") {
            iconName = "emoji-events";
          } else if (route.name === "Reservations") {
            iconName = "event";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Fields" component={FieldsStackScreen} options={{ title: "Canchas" }} />
      <Tab.Screen name="Teams" component={TeamsStackScreen} options={{ title: "Equipos" }} />
      <Tab.Screen name="Tournaments" component={TournamentsStackScreen} options={{ title: "Torneos" }} />
      <Tab.Screen name="Reservations" component={ReservationsStackScreen} options={{ title: "Reservas" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
};
