// Backend server root, set in mobile/.env (EXPO_PUBLIC_API_URL)..
// To use a local backend, override it in mobile/.env.local, e.g.
// EXPO_PUBLIC_API_URL=http://192.168.0.10:8000
export const API_ROOT = (
  process.env.EXPO_PUBLIC_API_URL ||
  "https://5-word-voc-production.up.railway.app"
).replace(/\/+$/, "");

export const NOTIFICATIONS_BASE_URL = `${API_ROOT}/api/notifications`;

const API_BASE_URL = `${API_ROOT}/api/vocabulary`;

export default API_BASE_URL;
