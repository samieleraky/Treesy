import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ← tilpas stien
import Navbar from "../components/Navbar";        // ← tilpas stien

// Chart.js indlæses via CDN i useEffect — ingen npm-pakke nødvendig

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-page {
    min-height: 100vh;
    background: #f8fafc;
    padding: 100px 24px 60px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .db-wrap {
    max-width: 900px;
    margin: 0 auto;
    animation: fadeUp 0.5s ease both;
  }

  /* Hero */
  .db-hero {
    background: linear-gradient(135deg, #065f46 0%, #10b981 100%);
    border-radius: 24px;
    padding: 32px 36px;
    margin-bottom: 20px;
    color: white;
  }
  .db-hero-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }
  .db-hero-name {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0 0 4px;
    color: white;
  }
  .db-hero-meta {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
  }
  .db-hero-meta strong { color: white; }
  .db-badge {
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 50px;
    padding: 6px 16px;
    font-size: 0.82rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
  }
  .db-hero-divider {
    height: 1px;
    background: rgba(255,255,255,0.15);
    margin-bottom: 20px;
  }
  .db-hero-stats {
    display: flex;
    gap: 36px;
    flex-wrap: wrap;
  }
  .db-hs-label {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 4px;
  }
  .db-hs-val {
    font-size: 1.8rem;
    font-weight: 800;
    color: white;
    line-height: 1;
  }
  .db-hs-unit {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.65);
    margin-left: 4px;
    font-weight: 400;
  }
  .db-season-note {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    padding: 10px 16px;
    margin-top: 18px;
    font-size: 0.82rem;
    color: rgba(255,255,255,0.85);
    line-height: 1.5;
  }

  /* Stat cards */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 20px;
  }
  .db-stat {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .db-stat:hover {
    box-shadow: 0 8px 24px rgba(6,95,70,0.1);
    transform: translateY(-2px);
  }
  .db-stat-icon {
    width: 36px;
    height: 36px;
    background: #f0fdf4;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-bottom: 12px;
  }
  .db-stat-label {
    font-size: 0.72rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  .db-stat-val {
    font-size: 1.6rem;
    font-weight: 800;
    color: #111827;
    line-height: 1;
  }
  .db-stat-unit {
    font-size: 0.78rem;
    color: #6b7280;
    margin-left: 3px;
    font-weight: 400;
  }

  /* Chart */
  .db-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
  }
  .db-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .db-card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
  .db-legend {
    display: flex;
    gap: 12px;
    font-size: 0.78rem;
    color: #6b7280;
    align-items: center;
  }
  .db-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    display: inline-block;
    margin-right: 4px;
  }

  /* Transactions */
  .db-tx-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.9rem;
  }
  .db-tx-row:last-child { border: none; }
  .db-tx-name { font-weight: 600; color: #111827; margin-bottom: 2px; }
  .db-tx-date { font-size: 0.78rem; color: #9ca3af; }
  .db-tx-right { display: flex; align-items: center; gap: 10px; }
  .db-tx-amount { font-weight: 700; color: #111827; }
  .db-pill {
    font-size: 0.72rem;
    padding: 3px 10px;
    border-radius: 50px;
  }
  .db-pill-green { background: #dcfce7; color: #166534; }
  .db-pill-gray { background: #f3f4f6; color: #6b7280; }

  /* Sub info */
  .db-sub-info {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 20px;
    font-size: 0.88rem;
    color: #065f46;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .db-sub-info strong { font-weight: 700; }

  /* Logout */
  .db-logout {
    display: inline-block;
    margin-top: 8px;
    font-size: 0.85rem;
    color: #9ca3af;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .db-logout:hover { color: #6b7280; }

  /* Loading / Error */
  .db-loading {
    text-align: center;
    padding: 80px 0;
    color: #6b7280;
    font-size: 0.95rem;
  }
  .db-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #e5e7eb;
    border-top-color: #10b981;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* No subscription */
  .db-no-sub {
    text-align: center;
    padding: 60px 24px;
    background: white;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
  }
  .db-no-sub h3 { color: #065f46; font-size: 1.2rem; margin-bottom: 8px; }
  .db-no-sub p { color: #6b7280; margin-bottom: 24px; }
  .db-no-sub a {
    padding: 12px 28px;
    background: linear-gradient(135deg, #10b981, #065f46);
    color: white;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .db-stats { grid-template-columns: 1fr; }
    .db-hero { padding: 24px 20px; }
    .db-hero-stats { gap: 20px; }
    .db-hero-name { font-size: 1.3rem; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return Number(n).toLocaleString("da-DK");
}

// ─── Component ────────────────────────────────────────────────────────────────
// Denne side:
// 1. Henter dashboard-data fra GET /api/Dashboard med JWT-token i Authorization header
// 2. Viser hero med navn og nøgletal
// 3. Viser tre stat-kort (træer, CO2, areal)
// 4. Viser CO2-graf over tid via Chart.js (indlæses fra CDN)
// 5. Viser seneste transaktioner
// 6. Viser abonnementsstatus
//
// Kræver at AuthContext er sat op og at brugeren er logget ind.
// Beskyt ruten med <ProtectedRoute> i din router.

let chartInstance = null; // holder styr på Chart.js instansen så vi kan destroy den

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inject styles
  useEffect(() => {
    const id = "db-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  // Hent dashboard data
  useEffect(() => {
    if (!user?.token) return;

    fetch("http://localhost:5106/api/Dashboard", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kunne ikke hente dashboard");
        return res.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [user]);

  // Tegn CO2-graf når data er klar
  useEffect(() => {
    if (!data?.co2Timeline?.length) return;

    // Indlæs Chart.js fra CDN dynamisk
    const existing = document.getElementById("chartjs-cdn");
    const draw = () => {
      const canvas = document.getElementById("db-co2-chart");
      if (!canvas) return;

      if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

      const labels = data.co2Timeline.map((p) => p.month);
      const values = data.co2Timeline.map((p) => p.co2);

      const ctx = canvas.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, 0, 200);
      grad.addColorStop(0, "rgba(16,185,129,0.2)");
      grad.addColorStop(1, "rgba(16,185,129,0)");

      chartInstance = new window.Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
            data: values,
            borderColor: "#065f46",
            backgroundColor: grad,
            borderWidth: 2.5,
            pointBackgroundColor: "#065f46",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#065f46",
              titleColor: "rgba(255,255,255,0.7)",
              bodyColor: "#fff",
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (c) => ` ${fmt(c.parsed.y)} kg CO₂`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "rgba(0,0,0,0.04)" },
              ticks: {
                color: "#9ca3af",
                font: { size: 11 },
                callback: (v) => fmt(v) + " kg",
              },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#9ca3af", font: { size: 11 } },
            },
          },
        },
      });
    };

    if (existing) {
      draw();
    } else {
      const script = document.createElement("script");
      script.id = "chartjs-cdn";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = draw;
      document.head.appendChild(script);
    }

    return () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    };
  }, [data]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="db-page">
          <div className="db-loading">
            <div className="db-spinner" />
            Henter dit dashboard...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="db-page">
          <div className="db-loading">⚠️ {error}</div>
        </div>
      </>
    );
  }

  const { customer, subscription, stats, co2Timeline, transactions } = data;

  // ── Ingen abonnement ───────────────────────────────────────────────────────
  if (!subscription) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div className="db-page">
          <div className="db-wrap">
            <div className="db-no-sub">
              <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
              <h3>Hej, {customer.name}</h3>
              <p>Du har ikke et aktivt abonnement endnu. Vælg en pakke og kom i gang.</p>
              <Link to="/#pakker">Se pakker</Link>
            </div>
            <button className="db-logout" onClick={handleLogout}>Log ud</button>
          </div>
        </div>
      </>
    );
  }

  // ── Fuldt dashboard ────────────────────────────────────────────────────────
  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="db-page">
        <div className="db-wrap">

          {/* Hero */}
          <div className="db-hero">
            <div className="db-hero-top">
              <div>
                <h1 className="db-hero-name">Hej, {customer.name} 👋</h1>
                <p className="db-hero-meta">
                  Medlem siden <strong>{customer.memberSince}</strong>
                  &nbsp;·&nbsp; {customer.monthsActive} måneder aktiv
                </p>
              </div>
              <span className="db-badge">🌳 {subscription.planName}</span>
            </div>
            <div className="db-hero-divider" />
            <div className="db-hero-stats">
              <div>
                <div className="db-hs-label">Træer plantet i år</div>
                <div className="db-hs-val">
                  {fmt(stats.treesPerYear)}
                  <span className="db-hs-unit">træer</span>
                </div>
              </div>
              <div>
                <div className="db-hs-label">CO₂ absorberet</div>
                <div className="db-hs-val">
                  {fmt(stats.co2Kg)}
                  <span className="db-hs-unit">kg</span>
                </div>
              </div>
              <div>
                <div className="db-hs-label">Skovområde</div>
                <div className="db-hs-val">
                  {stats.footballPitches}
                  <span className="db-hs-unit">fodboldbaner</span>
                </div>
              </div>
            </div>
            <div className="db-season-note">
              🌿 Dine træer plantes i to omgange om året — omkring regnsæsonerne i Tanzania.
            </div>
          </div>

          {/* Stat kort */}
          <div className="db-stats">
            <div className="db-stat">
              <div className="db-stat-icon">🌱</div>
              <div className="db-stat-label">Træer plantet i alt</div>
              <div className="db-stat-val">{fmt(stats.totalTreesPlanted)}</div>
            </div>
            <div className="db-stat">
              <div className="db-stat-icon">💨</div>
              <div className="db-stat-label">CO₂ bidraget i år</div>
              <div className="db-stat-val">
                {fmt(stats.co2Kg)}
                <span className="db-stat-unit">kg</span>
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat-icon">🌍</div>
              <div className="db-stat-label">Skovområde</div>
              <div className="db-stat-val">
                {stats.footballPitches}
                <span className="db-stat-unit">baner</span>
              </div>
            </div>
          </div>

          {/* Abonnementsstatus */}
          <div className="db-sub-info">
            <span>
              <strong>{subscription.planName}</strong> — {subscription.billing === "yearly" ? "Årlig" : "Månedlig"} · Status: {subscription.status}
            </span>
            <span style={{ color: "#6b7280", fontSize: "0.82rem" }}>
              Næste betaling: {subscription.currentPeriodEnd}
            </span>
          </div>

          {/* CO2 graf */}
          {co2Timeline?.length > 0 && (
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">CO₂ bidrag over tid</h3>
                <div className="db-legend">
                  <span>
                    <span className="db-legend-dot" style={{ background: "#065f46" }} />
                    CO₂ (kg)
                  </span>
                </div>
              </div>
              <div style={{ position: "relative", height: 200 }}>
                <canvas id="db-co2-chart" />
              </div>
            </div>
          )}

          {/* Transaktioner */}
          {transactions?.length > 0 && (
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">Seneste transaktioner</h3>
              </div>
              {transactions.map((tx, i) => (
                <div className="db-tx-row" key={i}>
                  <div>
                    <div className="db-tx-name">{tx.description}</div>
                    <div className="db-tx-date">{tx.date}</div>
                  </div>
                  <div className="db-tx-right">
                    <span className="db-tx-amount">{fmt(tx.amount)} kr</span>
                    <span className={`db-pill ${tx.status === "active" || tx.status === "paid" ? "db-pill-green" : "db-pill-gray"}`}>
                      {tx.status === "active" ? "Aktiv" : tx.status === "paid" ? "Betalt" : tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="db-logout" onClick={handleLogout}>Log ud</button>
        </div>
      </div>
    </>
  );
}