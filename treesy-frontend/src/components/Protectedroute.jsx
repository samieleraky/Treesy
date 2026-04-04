import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ← tilpas stien

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Brug denne komponent i din router til at beskytte sider der kræver login.
//
// Eksempel i App.jsx / router:
//   <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
//
// Hvis brugeren ikke er logget ind sendes de til /login.
// Mens auth-state loader vises ingenting (undgår flash af login-siden).

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // Vent til localStorage er tjekket

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}