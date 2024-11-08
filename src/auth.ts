import { jwtDecode } from "jwt-decode";

export async function login(username: string, password: string) {
  const response = await fetch(`http://localhost:1116/blog/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data.access_token;
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('access_token');
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}
