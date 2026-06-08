// src/shared/constants/endpoints.js

const AUTH_URL = process.env.EXPO_PUBLIC_AUTH_URL || "http://localhost:3007/api/v1/auth";
const USER_URL = process.env.EXPO_PUBLIC_USER_URL || "http://localhost:3008/kinalSportsUser/v1";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${AUTH_URL}/login`,
    REGISTER: `${AUTH_URL}/register`,
    VERIFY_EMAIL: `${AUTH_URL}/verify-email`,
    RESEND_VERIFICATION: `${AUTH_URL}/resend-verification`,
    FORGOT_PASSWORD: `${AUTH_URL}/forgot-password`,
    RESET_PASSWORD: `${AUTH_URL}/reset-password`,
    REFRESH: `${AUTH_URL}/refresh`,
    GET_USER: `${AUTH_URL}/users`,
  },
  USER: {
    PROFILE: `${USER_URL}/users/profile`,
    UPDATE_PROFILE: `${USER_URL}/users/profile`,
    RESERVATIONS: `${USER_URL}/reservations`,
    RESERVATIONS_BY_ID: (id) => `${USER_URL}/reservations/${id}`,
    CREATE_RESERVATION: `${USER_URL}/reservations`,
    CANCEL_RESERVATION: (id) => `${USER_URL}/reservations/${id}/cancel`,
    FIELDS: `${USER_URL}/fields`,
    FIELDS_BY_ID: (id) => `${USER_URL}/fields/${id}`,
    TEAMS: `${USER_URL}/teams`,
    CREATE_TEAM: `${USER_URL}/teams`,
    TEAM_BY_ID: (id) => `${USER_URL}/teams/${id}`,
    TOURNAMENTS: `${USER_URL}/tournaments`,
    TOURNAMENT_BY_ID: (id) => `${USER_URL}/tournaments/${id}`,
  },
};
