const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const fallback = `http://${host}:8000/api/`;
export const api = process.env.NEXT_PUBLIC_API_URL || fallback;
