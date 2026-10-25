import axios from "axios";

const API_URL = "http://localhost:4000";
const TOKEN_KEY = "access_token";

export const getAccessToken = () => sessionStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
};

let onAuthFailure = () => {};
export const setAuthFailureHandler = (fn) => {
  onAuthFailure = fn;
};

export const api = axios.create({ baseURL: API_URL, withCredentials: true });

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A refresh token works only once, so simultaneous 401s must share one refresh call
let refreshPromise = null;
const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return res.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// On 401: refresh once, then retry the original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        setAccessToken(null);
        onAuthFailure(); // refresh failed: log the user out
      }
    }
    return Promise.reject(error);
  }
);