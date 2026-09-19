// Shape matches what edunotify-backend actually returns from
// POST /api/auth/register, POST /api/auth/login and GET /api/auth/me.
// (see backend/routes/auth.js -> publicUser())

export interface User {
  id: string;
  school: string;
  fullName: string;
  email: string;
  role: "admin" | "teacher";
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}