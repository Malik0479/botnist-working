// Auto-detects: If on localhost, use localhost. If on web, use Render.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";