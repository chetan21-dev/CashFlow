import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getLocalStorage, removeLocalStorage } from "../utils/localStorage";

export const TOKEN_KEY = "jwt-token"; // same key your Navbar already uses
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getLocalStorage(TOKEN_KEY));
  const [account, setAccount] = useState(null);

  // Load the logged-in user's details whenever the token changes
  useEffect(() => {
    if (!token) return;
    let ignore = false;

    axios
      .get("http://localhost:4000/account/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => !ignore && setAccount(res.data))
      .catch((err) => {
        // Expired or invalid token: log out
        if (!ignore && err.response?.status === 401) {
          removeLocalStorage(TOKEN_KEY);
          setToken(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const login = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    removeLocalStorage(TOKEN_KEY);
    setToken(null);
    setAccount(null);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn: !!token, token, account: token ? account : null, login, logout }),
    [token, account, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};