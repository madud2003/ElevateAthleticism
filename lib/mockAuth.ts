// Simple in-memory auth store for development/testing only
type User = { email: string; password: string; role?: 'admin' | 'user' };

const users = new Map<string, User>();

export function registerUser(email: string, password: string, role: 'admin' | 'user' = 'user') {
  if (users.has(email)) return false;
  users.set(email, { email, password, role });
  return true;
}

export function verifyUser(email: string, password: string) {
  const u = users.get(email);
  if (!u) return false;
  return u.password === password;
}

export function getUser(email: string) {
  const u = users.get(email);
  if (!u) return null;
  return { email: u.email, role: u.role || 'user' };
}

// Seed a default admin user for convenience
// Only seed a default admin in local development when explicitly enabled.
// Set SEED_DEFAULT_ADMIN=true in .env.local to enable.
if (process.env.NODE_ENV === 'development' && process.env.SEED_DEFAULT_ADMIN === 'true') {
  registerUser('admin@local', 'password', 'admin');
}
