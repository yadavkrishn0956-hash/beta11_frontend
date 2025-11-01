// Mock API for development
export const mockApi = {
  ping: async (): Promise<{ ok: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ok: true });
      }, 100);
    });
  },
};

// API base URL
export const API_BASE = '/api';

// Mock fetch wrapper
export const api = {
  get: async (endpoint: string) => {
    if (endpoint === '/ping') {
      return mockApi.ping();
    }
    throw new Error(`Endpoint ${endpoint} not implemented`);
  },
};
