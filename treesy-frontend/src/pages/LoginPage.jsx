import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ← tilpas stien
import Navbar from "../components/Navbar";        // ← tilpas stien

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .login-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0fdf4 0%, #ffffff 60%, #ecfdf5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 24px 60px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .login-card {
    background: white;
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(16,185,129,0.08), 0 4px 16px rgba(0,0,0,0.05);
    animation: fadeUp 0.5s ease both;
  }
  .login-logo {
    text-align: center;
    margin-bottom: 28px;
  }
  .login-logo img { height: 40px; }
  .login-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #065f46;
    text-align: center;
    margin: 0 0 6px;
  }
  .login-sub {
    font-size: 0.9rem;
    color: #6b7280;
    text-align: center;
    margin: 0 0 28px;
  }
  .login-tabs {
    display: flex;
    background: #f3f4f6;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 24px;
  }
  .login-tab {
    flex: 1;
    padding: 9px;
    border: none;
    background: transparent;
    border-radius: 9px;
    font-size: 0.88rem;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .login-tab.active {
    background: white;
    color: #065f46;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .login-field {
    margin-bottom: 16px;
  }
  .login-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }
  .login-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 0.95rem;
    font-family: inherit;
    color: #111827;
    background: #f9fafb;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }
  .login-input:focus {
    outline: none;
    border-color: #10b981;
    background: white;
    box-shadow: 0 0 0 4px rgba(16,185,129,0.1);
  }
  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #10b981, #065f46);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 8px;
    box-shadow: 0 6px 20px rgba(16,185,129,0.3);
    transition: all 0.25s ease;
  }
  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(16,185,129,0.4);
  }
  .login-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  .login-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.88rem;
    color: #dc2626;
    margin-bottom: 16px;
    text-align: center;
  }
  .login-footer {
    text-align: center;
    font-size: 0.82rem;
    color: #9ca3af;
    margin-top: 20px;
  }
  .login-footer a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
  }
  @media (max-width: 480px) {
    .login-card { padding: 32px 20px; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
// Siden håndterer både login og registrering via tabs.
// Efter succesfuldt login/register sendes brugeren til /dashboard.
export default function LoginPage() {
  const [tab, setTab] = useState("login");       // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Inject styles
  useEffect(() => {
    const id = "login-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  // Hvis allerede logget ind — send til dashboard
  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = tab === "login"
      ? "http://localhost:5106/api/Auth/login"
      : "http://localhost:5106/api/Auth/register";

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
        setError(data.message ?? "Noget gik galt — prøv igen");
        return;
      }

      login(data);           // gem token i context + localStorage
      navigate("/dashboard"); // send til dashboard
    } catch {
      setError("Kunne ikke forbinde til serveren");
    } finally {
      setLoading(false);
    }
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

          {/* Tabs */}
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

          {/* Fejlbesked */}
          {error && <div className="login-error">{error}</div>}

          {/* Formular */}
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
              <>Har du ikke en konto? <a onClick={() => setTab("register")} style={{cursor:"pointer"}}>Opret konto</a></>
            ) : (
              <>Har du allerede en konto? <a onClick={() => setTab("login")} style={{cursor:"pointer"}}>Log ind</a></>
            )}
          </p>

        </div>
      </div>
    </>
  );
}