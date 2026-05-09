import { useMemo, useState } from "react";
import { logoutApi } from "../services/authservice";
import { AuthContext } from "./auth-context";

const readStoredUser = () => {
  const savedUser = localStorage.getItem("user");
  try {
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading] = useState(false);

  const login = ({ accessToken, refreshToken, user: nextUser }) => {
    setUser(nextUser);
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    localStorage.setItem("token", accessToken);

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const logout = async () => {
    try {
      if (localStorage.getItem("token")) {
        await logoutApi();
      }
    } catch {
      // Local logout should still complete if the token is already invalid.
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
