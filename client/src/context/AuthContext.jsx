import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("nexgen_user") || "null"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("nexgen_token")));

  useEffect(() => {
    if (!localStorage.getItem("nexgen_token")) return;
    api.get("/auth/me").then(({ data }) => {
      setUser(data.user);
      localStorage.setItem("nexgen_user", JSON.stringify(data.user));
    }).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin: user?.role === "ADMIN",
    async login(email, password) {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("nexgen_token", data.token);
      localStorage.setItem("nexgen_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    },
    logout() {
      localStorage.removeItem("nexgen_token");
      localStorage.removeItem("nexgen_user");
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
