const apiUrl = import.meta.env.VITE_API_URL?.trim();

if (!apiUrl) {
  // eslint-disable-next-line no-console
  console.error("Missing VITE_API_URL. Restart the dev server after updating Frontend/.env.");
}

export const API_BASE_URL = (apiUrl || "").replace(/\/$/, "");

export const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;
