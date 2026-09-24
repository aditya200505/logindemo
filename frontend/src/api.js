const API_URL = "http://127.0.0.1:5000/api/auth";

export async function request(endpoint, options) {
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      ...options
    });
  } catch {
    throw new Error("Cannot connect to the backend. Start backend/server.js on port 5000.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}