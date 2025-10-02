import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  email: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  email: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setEmail(savedEmail);
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    const decoded: JwtPayload = jwtDecode(token);
    setEmail(decoded.email);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
