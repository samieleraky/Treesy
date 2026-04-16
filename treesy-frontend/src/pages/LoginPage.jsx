import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/Login.css"; // Sørg for at have passende styles for login-siden
import API_BASE_URL from '../config'; // Tilføj denne linje for at importere API_BASE_URL



export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  const { login, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (needsPassword) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Auth/set-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.message ?? "Noget gik galt"); return; }
        login(data);
        navigate("/dashboard");
      } catch {
        setError("Kunne ikke forbinde til serveren");
      } finally {
        setLoading(false);
      }
      return;
    }

    const endpoint = tab === "login"
        ? `${API_BASE_URL}/api/Auth/login`
  : `${API_BASE_URL}/api/Auth/register`;

    const body = tab === "login"
      ? { email, password }
      : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "no_password") {
          setNeedsPassword(true);
          setError(null);
          return;
        }
        setError(data.message ?? "Noget gik galt — prøv igen");
        return;
      }

      login(data);
      navigate("/dashboard");
    } catch {
      setError("Kunne ikke forbinde til serveren");
    } finally {
      setLoading(false);
    }
  }

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