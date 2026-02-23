export interface AuthResponse {
  token: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  error: string | null;
}
