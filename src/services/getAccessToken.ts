// src/services/authService.ts
export class AuthService {
  private static STORAGE_KEY =
    `oidc.user:${import.meta.env.VITE_COGNITO_AUTHORITY}:${import.meta.env.VITE_COGNITO_CLIENT_ID}`;

  static getAccessToken(): string | null {
    const raw = window.sessionStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed?.access_token ?? null;
    } catch {
      return null;
    }
  }

  static getIdToken(): string | null {
    const raw = window.sessionStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed?.id_token ?? null;
    } catch {
      return null;
    }
  }
}
