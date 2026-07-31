import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedGym = localStorage.getItem("gym");

    if (storedToken) setToken(storedToken);
    if (storedGym) setGym(JSON.parse(storedGym));

    setLoading(false);
  }, []);

  const login = (token, gym) => {
    localStorage.setItem("token", token);
    localStorage.setItem("gym", JSON.stringify(gym));
    setToken(token);
    setGym(gym);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("gym");
    setToken(null);
    setGym(null);
  };

  return (
    <AuthContext.Provider value={{ token, gym, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);