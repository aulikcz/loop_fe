export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface TokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}