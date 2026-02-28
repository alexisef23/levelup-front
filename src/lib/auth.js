export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lu_token');
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lu_token', token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lu_token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('lu_user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function setUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lu_user', JSON.stringify(user));
}

export function clearUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lu_user');
}
