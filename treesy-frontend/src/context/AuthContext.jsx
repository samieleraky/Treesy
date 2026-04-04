import { createContext, useContext, useState, useEffect } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
// Placer <AuthProvider> rundt om hele din app i main.jsx eller App.jsx
// så alle sider kan tilgå login-state via useAuth()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { email, name, token }
  const [loading, setLoading] = useState(true); // true mens vi tjekker localStorage

  // Ved sideload: gendan bruger fra localStorage hvis token stadig er gemt
  useEffect(() => {
    const stored = localStorage.getItem("treesy_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("treesy_user");
      }
    }
    setLoading(false);
  }, []);

  // Kaldes efter succesfuldt login eller register
  function login(userData) {
    const u = { email: userData.email, name: userData.name, token: userData.token };
    setUser(u);
    localStorage.setItem("treesy_user", JSON.stringify(u));
  }

  // Kaldes ved logout
  function logout() {
    setUser(null);
    localStorage.removeItem("treesy_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Brug denne hook i alle komponenter der har brug for auth-info:
// const { user, login, logout, isLoggedIn } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth skal bruges inden i <AuthProvider>");
  return ctx;
}