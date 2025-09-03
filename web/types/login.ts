// types/auth.ts

import { User } from "./auth2";

export interface CurrentLevel {
  id: string;
  title: string;
  isCurrent: boolean;
}
export interface School {
  id: string;
  name: string;
  code: string;
  subdomain: string | null;
  logo: string | null;
  isActive: boolean;
  currentLevel?: CurrentLevel;
}

export interface SessionInfo {
  expiresAt: string;
  refreshExpiresAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  school: School | null;
  session: SessionInfo;
}

export interface LoginCredentials {
  loginMethod: "email" | "phone" | undefined;
  identifier: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  data?: LoginResponse;
  school?: School | null;
  error?: string;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  device?: string;
  ipAddress?: string;
}

export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Error types for better error handling
export interface ApiError {
  message: string;
  code: string;
  status?: string;
}

export interface LoginError extends Error {
  code?: string;
  status?: number;
}
