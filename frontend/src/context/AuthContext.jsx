import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getAccessToken, setAccessToken, setAuthFailureHandler } from "../utils/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Known immediately on first render, no loading state needed
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAccessToken());
  const [account, setAccount] = useState(null);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setIsLoggedIn(false);
    setAccount(null);
  }, []);

  // If a token refresh fails, log the user out
  useEffect(() => {
    setAuthFailureHandler(clearSession);
  }, [clearSession]);

  // Load account details whenever the user is logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    let ignore = false;
    api
      .get("/account/me")
      .then((res) => !ignore && setAccount(res.data))
      .catch((err) => console.error("Failed to load account:", err.response?.data ?? err.message));
    return () => {
      ignore = true;
    };
  }, [isLoggedIn]);

  const refreshAccount = useCallback(async () => {
    try {
      const res = await api.get("/account/me");
      setAccount(res.data);
    } catch {
      // keep the old value
    }
  }, []);

  const login = useCallback((accessToken) => {
    setAccessToken(accessToken);
    setAccount(null);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // deletes the refresh token and clears the cookie
    } catch {
      // clear locally even if the request fails
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ isLoggedIn, account: isLoggedIn ? account : null, login, logout, refreshAccount }),
    [isLoggedIn, account, login, logout, refreshAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};