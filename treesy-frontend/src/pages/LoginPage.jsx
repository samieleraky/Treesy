import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/Login.css"; // Sørg for at have passende styles for login-siden
import API_BASE_URL from '../config'; // Tilføj denne linje for at importere API_BASE_URL


// Login funktion - hovedkomponent for login siden
export default function LoginPage() {
  //States: gemmer al dynamisk data i komponenten
  const [tab, setTab] = useState("login"); //initialiserer jeg en state-variabel ved navn tab med startværdien "login" ved hjælp af useState-hooket. Gennem destrukturering udpakker jeg returværdien, som er et array med to elementer: den aktuelle state-værdi (tab) og en setter-funktion (setTab). Når brugeren skifter mellem login- og register-fanerne, kaldes setTab med henholdsvis "login" eller "register", hvilket får komponenten til at re-rendre med den nye fane akti
  const [email, setEmail] = useState(""); //gemmer brugerns email
  const [password, setPassword] = useState(""); // Jeg bruger useState til at oprette en state-variabel password. Samtidig får jeg en funktion kaldet setPassword som jeg kan bruge til at ændre værdien af password. Når jeg kalder setPassword med en ny værdi, vil komponenten automatisk genrendere med den opdaterede værdi." 
  const [name, setName] = useState(""); // "Jeg initialiserer en state-variabel kaldet name med en tom streng ved hjælp af useState-hooket. Destruktureringen giver mig både den nuværende værdi (name) og en setter-funktion (setName). I inputfeltets onChange-hændelse kalder jeg setName med e.target.value, hvilket opdaterer staten. Når staten ændres, trigger React et re-render af komponenten med den nye name-værdi – præcis som du beskriver."
  const [error, setError] = useState(null); //gemmer eventuelle fejlbeskeder
  const [loading, setLoading] = useState(false); // // Deaktiverer knap og viser spinner
  const [needsPassword, setNeedsPassword] = useState(false); //Special tilstand: bruger har købt pakke men mangler kodeord

  //Jeg bruger destrukturering til at udpakke tre specifikke værdier fra det objekt som useAuth()-hooket returnerer. useAuth er en custom hook – altså en hook jeg selv (eller en anden udvikler) har bygget – som giver mig adgang til autentificeringsfunktionalitet i hele applikationen.
  const { login, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate(); //jeg initialiserer en navigate-funktion ved at kalde useNavigate(). Denne funktion giver mig mulighed for navigation mellem sider

  //Hvis bruger allede er logget ind så sendes brugeren til dashboard
  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  //asynkron funktion handleSubmit som kører når brugeren trykker Log in eller Opret Konto
  async function handleSubmit(e) {
    e.preventDefault(); //forhindrer at siden genindlæses
    setError(null); //nulstiller eventuelle gamle fejl
    setLoading(true); //Viser at vi er igang med at sende data

    //Speciel tilfælde: Bruger mangler at vælge password (de har allerede købt en pakke) 
    if (needsPassword) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Auth/set-password`, { //fetch kald til backend for at forsøge at sætte kodeord for eksistrende bruger
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.message ?? "Noget gik galt"); return; }
        login(data); //gemmer brugerdata i auth systemet
        navigate("/dashboard"); //går til dashboard
      } catch {
        setError("Kunne ikke forbinde til serveren");
      } finally {
        setLoading(false);//stopper loading uanset om det lykkedes eller ej
      }
      return; //funktionen stopper her
    }

    // NORMAL LOGIN/ELLER REGISTRERING:
    // Vælger hvilket endpoint vi skal bruge baseret på fanen (login eller register)
    const endpoint = tab === "login"
        ? `${API_BASE_URL}/api/Auth/login` //login endpoint
  : `${API_BASE_URL}/api/Auth/register`; //register endpoint

  // Vælger hvilke data der skal sendes baseret på fanen
    const body = tab === "login"
      ? { email, password } // Login: kun email og kodeord
      : { email, password, name }; //Register: også navn

    try { //try-catch. Sender data til Server via POST
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json(); //Henter data fra serveren

      //Hvis serveren svarer med en fejl
      if (!res.ok) {
        if (data.message === "no_password") { // Speciel case: Brugeren findes men har ikke sat kodeord endnu
          setNeedsPassword(true);
          setError(null);
          return;
        }
        setError(data.message ?? "Noget gik galt — prøv igen");
        return;
      }

       // ALT OK: Gemmer brugerdata og sender til dashboard
      login(data);
      navigate("/dashboard");
    } catch {
      setError("Kunne ikke forbinde til serveren");
    } finally {
      setLoading(false); //stopper loading
    }
  }

  //Return komponent som viser UI i javascript jsx. HVIS BRUGEREN MANGLER KODEORD
  if (needsPassword) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="login-page">
          <div className="login-card">
            <div className="login-logo">
              <img src="/B-transparent-bg.png" alt="Treesy" />
            </div>
            <h1 className="login-title">Velkommen! 🌱</h1>
            <p className="login-sub">
              Vi kan se du allerede har købt en pakke. Vælg et kodeord for at aktivere din konto.
            </p>
            {error && <div className="login-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Dit navn</label>
                <input className="login-input" type="text" placeholder="Dit navn"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="login-field">
                <label className="login-label">Vælg kodeord</label>
                <input className="login-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={6} />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "Vent..." : "Aktiver konto"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // NORMAL LOGIN/REGISTRERING SIDE (det meste af tiden vises denne)
  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img src="/B-transparent-bg.png" alt="Treesy" />
          </div>

          <h1 className="login-title">
            {tab === "login" ? "Velkommen tilbage" : "Opret konto"}
          </h1>
          <p className="login-sub">
            {tab === "login"
              ? "Log ind for at se dit klimaaftryk"
              : "Bliv en del af Treesy"}
          </p>

          <div className="login-tabs">
            <button
              className={`login-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => { setTab("login"); setError(null); }}
            >
              Log ind
            </button>
            <button
              className={`login-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => { setTab("register"); setError(null); }}
            >
              Opret konto
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

{/*LOGIN FORMULAR */}
          <form onSubmit={handleSubmit}>
            {tab === "register" && (
              <div className="login-field">
                <label className="login-label">Navn</label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Dit navn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="din@email.dk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">Kodeord</label>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading
                ? "Vent..."
                : tab === "login" ? "Log ind" : "Opret konto"}
            </button>
          </form>

          <p className="login-footer">
            {tab === "login" ? (
              <>Har du ikke en konto? <a onClick={() => setTab("register")} style={{ cursor: "pointer" }}>Opret konto</a></>
            ) : (
              <>Har du allerede en konto? <a onClick={() => setTab("login")} style={{ cursor: "pointer" }}>Log ind</a></>
            )}
          </p>

          {isLoggedIn && (
            <button
              onClick={() => { logout(); navigate("/"); }}
              style={{
                marginTop: "16px",
                padding: "8px",
                background: "none",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                color: "#6b7280",
                cursor: "pointer",
                width: "100%"
              }}
            >
              Log ud
            </button>
          )}
        </div>
      </div>
    </>
  );
}