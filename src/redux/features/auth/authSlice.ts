import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "donor" | "recipient" | "admin";

export type AuthUser = {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  contact?: string;
  role?: UserRole;
  bloodGroup?: string;
  location?: string;
  district?: string;
  upazila?: string;
  emergencyContact?: string;
  gender?: string;
  age?: number;
  dateOfBirth?: string;
  lastDonation?: string;
  weight?: number;
  hasDisease?: boolean;
  diseaseDetails?: string;
  profileImage?: string;
  isAvailable?: boolean;
  isNotified?: boolean;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  pendingVerifyEmail: string | null;
  resetEmail: string | null;
  resetToken: string | null;
};

const storageKeys = {
  token: "authToken",
  user: "authUser",
  pendingVerifyEmail: "pendingVerifyEmail",
  resetEmail: "resetEmail",
  resetToken: "resetToken",
} as const;

const initialState: AuthState = {
  user: readJson<AuthUser>(storageKeys.user),
  token: readString(storageKeys.token),
  pendingVerifyEmail: readString(storageKeys.pendingVerifyEmail),
  resetEmail: readString(storageKeys.resetEmail),
  resetToken: readString(storageKeys.resetToken),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      writeJson(storageKeys.user, action.payload.user);
      writeString(storageKeys.token, action.payload.accessToken);
    },
    updateUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = { ...state.user, ...action.payload };
      writeJson(storageKeys.user, state.user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      remove(storageKeys.user);
      remove(storageKeys.token);
    },
    setPendingVerifyEmail: (state, action: PayloadAction<string>) => {
      state.pendingVerifyEmail = action.payload;
      writeString(storageKeys.pendingVerifyEmail, action.payload);
    },
    clearPendingVerifyEmail: (state) => {
      state.pendingVerifyEmail = null;
      remove(storageKeys.pendingVerifyEmail);
    },
    setResetEmail: (state, action: PayloadAction<string>) => {
      state.resetEmail = action.payload;
      writeString(storageKeys.resetEmail, action.payload);
    },
    setResetToken: (state, action: PayloadAction<string>) => {
      state.resetToken = action.payload;
      writeString(storageKeys.resetToken, action.payload);
    },
    clearResetFlow: (state) => {
      state.resetEmail = null;
      state.resetToken = null;
      remove(storageKeys.resetEmail);
      remove(storageKeys.resetToken);
    },
  },
});

export const {
  setCredentials,
  updateUser,
  logout,
  setPendingVerifyEmail,
  clearPendingVerifyEmail,
  setResetEmail,
  setResetToken,
  clearResetFlow,
} = authSlice.actions;

export default authSlice.reducer;

function readString(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function readJson<T>(key: string): T | null {
  const value = readString(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    remove(key);
    return null;
  }
}

function writeString(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function remove(key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
}
