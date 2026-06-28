const API_URL = "https://deportes-production.up.railway.app";

function getToken() {
  return localStorage.getItem("token") || "";
}

export function authHeaders(extra = {}) {
  return { "x-auth-token": getToken(), ...extra };
}

export function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "x-auth-token": token,
    ...(options.headers || {}),
  };
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

export default API_URL;
