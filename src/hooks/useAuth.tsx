import { User } from "@/types/email";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

// Mock Google login — replace with real Google OAuth in production
const MOCK_USER: User = {
  name: "Oliver Brown",
  email: "oliver.brown@domain.io",
  avatar: "https://ui-avatars.com/api/?name=Oliver+Brown&background=10b981&color=fff&bold=true",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("ri_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(() => {
    // In production: trigger Google OAuth flow
    setUser(MOCK_USER);
    localStorage.setItem("ri_user", JSON.stringify(MOCK_USER));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("ri_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
