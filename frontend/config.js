const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const api = `http://${host}:8000/api/`;
