import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Single in-flight refresh promise to dedupe concurrent 401s
let refreshPromise = null;

const broadcastLogout = () => {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  } catch {}
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const url = originalRequest.url || '';
      // Avoid loops for auth endpoints
      if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
        broadcastLogout();
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = apiClient
          .post('/api/auth/refresh')
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        return apiClient(originalRequest);
      } catch (e) {
        broadcastLogout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

