import { createContext, useContext, useState, useEffect } from "react";
// createContext: Opretter en beholder til data der skal deles på tværs af komponenter
// useContext: Bruges til at læse data fra en Context
// useState: Gemmer brugerdata og loading-status
// useEffect: Kører kode når komponenten mountes (her: gendan bruger fra localStorage)

// ─── Context ──────────────────────────────────────────────────────────────────
// Opretter en Context beholder med startværdien null
// Context er som en "global state" der kan tilgås fra ALLE komponenter
const AuthContext = createContext(null);

// AuthProvider er en "wrapper" komponent der omgiver hele applikationen
// Typisk placeres den i App.js eller main.jsx så ALLE komponenter har adgang
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // user: Gemmer den loggede brugers data (email, name, token) Initialiseres som null = ingen bruger er logget ind
  const [loading, setLoading] = useState(true);  // loading: True mens vi tjekker localStorage (undgår "flash" af uautoriseret indhold)

  // Ved sideload: Formål: Tjekker om brugeren var logget ind FØR (fra sidste besøg)
  useEffect(() => {
    const stored = localStorage.getItem("treesy_user"); // Forsøger at hente gemt bruger fra localStorage
    if (stored) {
      try {
        setUser(JSON.parse(stored)); // Hvis der ER gemt data, konverter JSON-streng til JavaScript objekt
      } catch {
        localStorage.removeItem("treesy_user"); // Hvis JSON'en er korrupt, slet den så vi ikke får fejl senere
      }
    }
    setLoading(false); //uanset hvad: loading er færdig 
  }, []); // tom array --> kun kun en gang ved start

  // LOGIN funktion som kaldes efter succesfuldt backend-login
  function login(userData) { // Udtrækker KUN de nødvendige felter (email, name, token)
    // Vi gemmer IKKE password, da det er dårlig sikkerhedspraksis
    const u = { email: userData.email, name: userData.name, token: userData.token };
    setUser(u);  //Gemmer bruger i Reats state (andre komponenter kan nu se at bruger er logget ind)
    localStorage.setItem("treesy_user", JSON.stringify(u));
  }

  // Kaldes ved logout
  function logout() {
    setUser(null); //fjerner brugeren fra react State
    localStorage.removeItem("treesy_user"); //Fjerner bruger fra local storage (så de ikke er logget ind efter genindlæsning)
  }

  // RETURN: Gør auth-data tilgængelig for ALLE børnekomponenter
  return ( 
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggedIn: !!user }}>
      {children}   {/* Alle komponenter inde i AuthProvider får adgang til auth-data */}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Brug denne hook i alle komponenter der har brug for auth-info:
// const { user, login, logout, isLoggedIn } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext); // useContext henter værdien fra AuthContext
  if (!ctx) throw new Error("useAuth skal bruges inden i <AuthProvider>");
  return ctx;
}