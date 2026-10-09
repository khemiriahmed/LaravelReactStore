import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // login
  const loginUser = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  // charger user connecté
  useEffect(() => {
    if (token) {
      api
        .get("/user")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook custom
export const useAuth = () => useContext(AuthContext);